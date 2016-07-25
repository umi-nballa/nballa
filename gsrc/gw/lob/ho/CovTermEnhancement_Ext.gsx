package gw.lob.ho

uses gw.util.Pair
uses una.config.ConfigParamsUtil
uses java.math.BigDecimal
uses gw.api.productmodel.CovTermOpt

/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/16/16
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement CovTermEnhancement_Ext : gw.api.domain.covterm.CovTerm {

  @Param("holine", "The current homeowners instance")
  @Param("option", "The deductible option which availability is going to be evaluated")
  @Returns("The availability of the received option")
  static function isMedPayOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _hoLine: entity.HomeownersLine_HOE) : boolean {
    var result = true
    var state = _hoLine.Branch.BaseState
    var isValidForMedPayLimitOption = HOPolicyType_HOE.TF_MEDICALPAYMENTSLIMITELIGIBLE.TypeKeys.contains(_hoLine.HOPolicyType)
    var personalLiabilityLimit = _hoLine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value
    var variantStates : List<typekey.Jurisdiction> = {TC_TX, TC_HI}

    if(isValidForMedPayLimitOption){
      if(variantStates.contains(state)){
        result = isMedPayOptionAvailableVariantFilter(personalLiabilityLimit, _option, state)
      }else{
        result = isMedPayOptionAvailableStandardFilter(personalLiabilityLimit, _option, state)
      }
    }

    return result
  }

  @Param("option", "The deductible option which availability is to be evaluated.")
  @Param("dwelling", "The current dwelling instance.")
  @Returns("The availability of the evaluated option")
  static function isHurricaneDedOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _dwelling: entity.Dwelling_HOE) : boolean {
    var result : boolean = true

    var state = _dwelling.Branch.BaseState
    var otherPerilsValue = _dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
    var dwellingValue = _dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    var dwellingLimitsRange = ConfigParamsUtil.getRange(TC_DWELLINGLIMITRANGEFORHURRICANEDEDRESTRICTION, state)
    var shouldLimitHurricaneDedOptions = ConfigParamsUtil.getBoolean(TC_LimitHurricaneOptions, state, _dwelling.HOPolicyType.Code) and dwellingLimitsRange != null
    var shouldLimitHurricaneDedOptionsForThreshold = ConfigParamsUtil.getBoolean(TC_LimitHurricaneOptionsForThreshold, state)

    if(shouldLimitHurricaneDedOptions
        and dwellingValue > dwellingLimitsRange.LowerBound
        and dwellingValue < dwellingLimitsRange.UpperBound){
      var restrictedValues = ConfigParamsUtil.getList(TC_RestrictedHurricaneDedutibleValues, state, otherPerilsValue?.setScale(0)?.toString())

      if(restrictedValues.HasElements){
        result = restrictedValues?.contains(_option.Value?.setScale(0)?.toString())
      }
    }

    if(shouldLimitHurricaneDedOptionsForThreshold){
      var excludedValues = ConfigParamsUtil.getList(TC_RestrictedHurricaneDedutibleValuesForThreshold, state)
      var thresholdAmount = ConfigParamsUtil.getDouble(TC_HurricanePerecentageRestrictionCovAThreshold, state)

      if(dwellingValue?.doubleValue() > thresholdAmount and excludedValues.HasElements){
        result = !excludedValues?.contains(_option.Value?.setScale(0, BigDecimal.ROUND_FLOOR).toString())
      }
    }

    return result
  }

  @Param("homeOwnersLine", "The homeowners line instance to be evaluated.")
  @Returns("The existence type evaluated for the given homeowners instance.")
  static function getFireDwellingPremiseLiabilityExistence(homeOwnersLine : HomeownersLine_HOE) : ExistenceType{
    var result : ExistenceType
    var contact = homeOwnersLine.Branch.PrimaryNamedInsured.ContactDenorm
    //    var isSuggestedForCorporation  //TODO tlv - filter for organization type  - this is not available, still.  question is will it ever be - BA will have to answer

    switch(homeOwnersLine.BaseState){
      case TC_FL:
      case TC_HI:
          result = TC_REQUIRED
          break
      case TC_CA:
      case TC_TX:
          result = TC_SUGGESTED
          break
        default:
        result = TC_ELECTABLE
    }

    return result
  }

  @Param("covTermOpt", "The coverage term option to determine availability for.")
  @Param("hoLine", "The homeowners line instance for which to evaluate availability of the given covTermOpt.")
  @Returns("The availability of this covTermOpt.")
  static function isFireDwellingMedicalPaymentLimitAvailable(covTermOpt : gw.api.productmodel.CovTermOpt, hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true
    var allowedLimitsPersonalLiability = ConfigParamsUtil.getList(TC_FIREDWELLINGMEDICALPAYMENTSRESTRICTEDOPTIONS, hoLine.BaseState, hoLine.DPLI_Personal_Liability_HOE.PatternCode)
    var allowedLimitsPremiseLiability = ConfigParamsUtil.getList(TC_FIREDWELLINGMEDICALPAYMENTSRESTRICTEDOPTIONS, hoLine.BaseState, hoLine.DPLI_Premise_Liability_HOE_Ext.PatternCode)

    if(hoLine.BaseState == TC_CA){
      if(hoLine.DPLI_Premise_Liability_HOE_ExtExists and hoLine.Dwelling.Occupancy == TC_NONOWN){
        result = allowedLimitsPremiseLiability.hasMatch( \ limit -> limit?.toBigDecimal() == covTermOpt.Value)
      }else if(hoLine.DPLI_Personal_Liability_HOEExists){
        result = allowedLimitsPersonalLiability.hasMatch( \ limit -> limit?.toBigDecimal() == covTermOpt.Value)
      }
    }

    return result
  }

  static function isLossAssessmentLimitOptionAvailable(covTermOpt : gw.api.productmodel.CovTermOpt, hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.BaseState == TC_FL and hoLine.HOPolicyType == TC_DP3_Ext){
      if(hoLine.DPLI_Personal_Liability_HOEExists){
        result = ConfigParamsUtil.getList(TC_LossAssessmentOptionsWithPersonalLiability, hoLine.BaseState).contains(covTermOpt.Value?.setScale(0)?.toString())
      }else if(hoLine.Dwelling.ResidenceType == TC_CONDO){
        result = ConfigParamsUtil.getList(TC_LossAssessmentOptionsCondoOnly, hoLine.BaseState).contains(covTermOpt.Value?.setScale(0)?.toString())
      }
    }

    return result
  }

  public static function isSpecialLimitOptionAvailable(hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.BaseState == TC_FL or hoLine.BaseState == TC_CA){
      result = hoLine.Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    }

    return result
  }

  private static function isMedPayOptionAvailableVariantFilter(personalLiabilityLimit : BigDecimal, _option : gw.api.productmodel.CovTermOpt, state : Jurisdiction): boolean{
    var result = true

    if(state == TC_HI){     //Hawaii is a one-off.  If more than this exists in the future, probably move to a config parameter
      var limitsPairHigh = new Pair<BigDecimal, BigDecimal>(new BigDecimal(500000), new BigDecimal(5000))
      var limitsPairLow = new Pair<BigDecimal, BigDecimal>(new BigDecimal(300000), new BigDecimal(3000))

      if(personalLiabilityLimit == limitsPairHigh.First){
        result = _option.Value == limitsPairHigh.Second
      }else if(personalLiabilityLimit == limitsPairLow.First){
        result = _option.Value == limitsPairLow.Second
      }
    }

    return result
  }

  private static function isMedPayOptionAvailableStandardFilter(personalLiabilityLimit : BigDecimal, _option: gw.api.productmodel.CovTermOpt, state : Jurisdiction) : boolean{
    var result = true
    var personalLiabilityLimitThreshold = ConfigParamsUtil.getBigDecimal(ConfigParameterType_Ext.TC_MEDICALPAYMENTSLIMITTHRESHOLD, state)

    if(personalLiabilityLimit > personalLiabilityLimitThreshold){
      var allowedLimits = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_MEDICALPAYMENTRESTRICTEDOPTIONS, state)
      result = allowedLimits.hasMatch( \ limit -> limit?.toBigDecimal() == _option.Value)
    }

    return result
  }
}
