package una.productmodel

uses gw.util.Pair
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.OptionCovTerm
uses java.lang.StringBuilder
uses java.util.HashMap
uses gw.api.productmodel.CovTermOpt

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/10/16
 * Time: 3:11 PM
 * To change this template use File | Settings | File Templates.
 */
class CoverageTermAvailabilityUtil {
  private static final var HO_FILTER = "HO"
  private static final var DP_FILTER = "DP"
  private static final var CONDO_RENT_FILTER = "CONDO"

  @Param("option", "The CovTermOpt to evaluate availability for.")
  @Param("covTerm", "The CovTerm that the option is associated with.")
  @Param("coverable", "The related Coverable entity.")
  @Returns("Availability of the given option.")
  public static function isCovTermOptionAvailable(option : gw.api.productmodel.CovTermOpt, covTerm : OptionCovTerm, coverable : Coverable) : boolean{
    var result = true

    switch(covTerm.PatternCode){
      case "HOLI_MedPay_Limit_HOE":
        result = isMedPayOptionAvailable(option, coverable as entity.HomeownersLine_HOE)
        break
      case "HODW_Hurricane_Ded_HOE":
        result = isHurricaneDedOptionAvailable(option, coverable as Dwelling_HOE)
             and isOptionAvailableForSelectedAOPDeductible(option, coverable as Dwelling_HOE)
        break
      case "DPLI_MedPay_Limit_HOE":
        result = isFireDwellingMedicalPaymentLimitAvailable(option, coverable as HomeownersLine_HOE)
        break
      case "HOPL_LossAssCovLimit_HOE":
        result = isLossAssessmentLimitOptionAvailable(option, coverable as Dwelling_HOE)
        break
      case "HODW_JewelryWatchesFursLimit_HOE":
        result = isSpecialLimitOptionAvailable(coverable as HomeownersLine_HOE)
        break
      case "HODW_HurricaneDeductible_HOE":
      case "HODW_WindHail_Ded_HOE":
      case "HODW_NamedStrom_Ded_HOE_Ext":
        result = isOptionAvailableForSelectedAOPDeductible(option, coverable as Dwelling_HOE)
        break
      default:
        break
    }

    return result
  }

  @Param("covTerm", "The CovTerm to evaluate availability for.")
  @Param("coverable", "The related Coverable entity.")
  @Returns("Availability of the given option.")
  public static function isCoverageTermAvailable(patternCode : String, coverable : Coverable) : boolean{
    var result = true

    switch(patternCode){
      case "HOPL_Deductible_HOE":
        result = isLossAssessmentDeductibleAvailable(coverable as Dwelling_HOE)
        break
      case "HODW_ExecutiveCov_HOE_Ext":
        result = isExecutiveCoverageAvailable(coverable as Dwelling_HOE)
        break

      default:
        break
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

  private static function isMedPayOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _hoLine: entity.HomeownersLine_HOE) : boolean {
    var result = true
    var state = _hoLine.Branch.BaseState
    var isValidForMedPayLimitOption = HOPolicyType_HOE.TF_MEDICALPAYMENTSLIMITELIGIBLE.TypeKeys.contains(_hoLine.HOPolicyType)
    var personalLiabilityLimit = _hoLine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm.Value
    var variantStates : java.util.List = {Jurisdiction.TC_TX, Jurisdiction.TC_HI}

    if(isValidForMedPayLimitOption){
      if(variantStates.contains(state)){
        result = isMedPayOptionAvailableVariantFilter(personalLiabilityLimit, _option, state)
      }else{
        result = isMedPayOptionAvailableStandardFilter(personalLiabilityLimit, _option, state)
      }
    }

    return result
  }

  private static function isHurricaneDedOptionAvailable(_option: gw.api.productmodel.CovTermOpt, _dwelling: entity.Dwelling_HOE) : boolean {
    var result = true

    var state = _dwelling.Branch.BaseState
    var otherPerilsValue = _dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
    var dwellingValue = _dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    var dwellingLimitsRange = ConfigParamsUtil.getRange(TC_DWELLINGLIMITRANGEFORHURRICANEDEDRESTRICTION, state)
    var shouldLimitHurricaneDedOptions = ConfigParamsUtil.getBoolean(TC_LimitHurricaneOptions, state, _dwelling.HOPolicyType.Code) and dwellingLimitsRange != null
    var shouldLimitHurricaneDedOptionsForThreshold = ConfigParamsUtil.getBoolean(TC_LimitHurricaneOptionsForThreshold, state)

    if(shouldLimitHurricaneDedOptions
        and dwellingValue > dwellingLimitsRange.LowerBound
        and dwellingValue < dwellingLimitsRange.UpperBound){
      var restrictedValues = ConfigParamsUtil.getList(TC_RestrictedHurricaneDedutibleValues, state, otherPerilsValue?.setScale(0, BigDecimal.ROUND_FLOOR)?.toString())

      if(restrictedValues.HasElements){
        result = restrictedValues?.contains(_option.Value?.toString())
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

  private static function isOptionAvailableForSelectedAOPDeductible(option : CovTermOpt, dwelling : Dwelling_HOE) : boolean{
    var result = true
    var filterPrefix = getAOPFilterPrefix(dwelling)
    var state = dwelling.HOLine.BaseState
    var configType = ConfigParameterType_Ext.TC_AOP_RESTRICTEDOPTIONS

    if(ConfigParamsUtil.getBoolean(TC_ShouldLimitDeductibleOptionsForAOP, state, filterPrefix + option.CovTermPattern.CodeIdentifier)){
      var allPerilsValue = dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value.setScale(3)
      var optionValue = option.Value?.setScale(3, BigDecimal.ROUND_FLOOR).toString()

      var valueRestrictedOptions = ConfigParamsUtil.getList(configType, state, filterPrefix + allPerilsValue)
      var defaultRestrictedOptions = ConfigParamsUtil.getList(configType, state, filterPrefix)

      if(valueRestrictedOptions != null){
        result = valueRestrictedOptions.contains(optionValue)
      }else if(defaultRestrictedOptions != null){
        result = defaultRestrictedOptions.contains(optionValue)
      }
    }

    return result
  }

  private static function getAOPFilterPrefix(dwelling: Dwelling_HOE) : String{
    var result : String

    if(HOPolicyType_HOE.TF_HOTYPES.TypeKeys.contains(dwelling.HOPolicyType)){
      result = HO_FILTER
    }else if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(dwelling.HOPolicyType)){
      result = DP_FILTER
    }else if(HOPolicyType_HOE.TF_CONDOTYPES.TypeKeys.contains(dwelling.HOPolicyType) or dwelling.HOPolicyType == TC_HO4){
      result = CONDO_RENT_FILTER
    }

    return result
  }

  private static function isFireDwellingMedicalPaymentLimitAvailable(covTermOpt : gw.api.productmodel.CovTermOpt, hoLine : entity.HomeownersLine_HOE) : boolean{
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

  private static function isLossAssessmentLimitOptionAvailable(covTermOpt : gw.api.productmodel.CovTermOpt, dwelling : entity.Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL and dwelling.HOPolicyType == TC_DP3_Ext){
      if(dwelling.HOLine.DPLI_Personal_Liability_HOEExists){
        result = ConfigParamsUtil.getList(TC_LossAssessmentOptionsWithPersonalLiability, dwelling.Branch.BaseState).contains(covTermOpt.Value?.setScale(0, BigDecimal.ROUND_FLOOR)?.toString())
      }else if(dwelling.ResidenceType == TC_CONDO){
        result = ConfigParamsUtil.getList(TC_LossAssessmentOptionsCondoOnly, dwelling.Branch.BaseState).contains(covTermOpt.Value?.setScale(0, BigDecimal.ROUND_FLOOR)?.toString())
      }
    }

    return result
  }

  private static function isSpecialLimitOptionAvailable(hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.BaseState == TC_FL or hoLine.BaseState == TC_CA){
      result = hoLine.Dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value
    }

    return result
  }

  private static function isLossAssessmentDeductibleAvailable(dwelling : entity.Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL){
      result = dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value > 2000
          and dwelling.HOPolicyType == TC_HO6 or (dwelling.HOPolicyType == TC_DP3_EXT and dwelling.ResidenceType == TC_CONDO)
    }

    return result
  }

  private static function isExecutiveCoverageAvailable(dwelling : Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.PolicyLine.BaseState == TC_FL){
      result = dwelling.HOPolicyType == TC_HO3 and !dwelling.IsSecondaryOrSeasonal
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