package una.pageprocess

uses gw.web.productmodel.ProductModelSyncIssuesHandler
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.BooleanCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses una.utils.MathUtil
uses una.productmodel.CoveragesUtil
uses gw.api.domain.covterm.CovTerm
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/3/16
 * Time: 8:55 AM
 * To change this template use File | Settings | File Templates.
 */
class CovTermPOCHOEInputSet {

  // Sen Pitchaimuthu: Added onchange function to calculate the Other Structure, Personal Property and Loss of use
  // coverages based on Dwelling Coverage
  static function onchange(coverable: Coverable, _covTerm: gw.api.domain.covterm.CovTerm){
    switch(typeof coverable){
      case Dwelling_HOE:
          onChangeForDwellingCoverable(coverable as Dwelling_HOE, _covTerm)
          break
        default:
        break
    }
  }

  private static function onChangeForDwellingCoverable(dwelling : Dwelling_HOE, covTerm : CovTerm){
    dwelling.PolicyPeriod.editIfQuoted()
    ProductModelSyncIssuesHandler.syncCoverages(dwelling.PolicyPeriod.Lines*.AllCoverables, null)
    roundInputValue(dwelling, covTerm)

    switch(covTerm.PatternCode) {
      case "HODW_Dwelling_Limit_HOE":
      case "DPDW_Dwelling_Limit_HOE":
      case "HODW_PersonalPropertyLimit_HOE":
          setSectionILimitDefaults(dwelling, covTerm as DirectCovTerm)
          break
      case "HODW_ExecutiveCov_HOE_Ext":
          setExecutiveCoverageDefaults(dwelling, covTerm as BooleanCovTerm)
          break
      default:
        break;
    }
  }

  static function validate(coverable: Coverable, covTerm: gw.api.domain.covterm.DirectCovTerm):String{
    var result : String

    if(coverable typeis Dwelling_HOE){
      result = validateCalculatedLimits(covTerm, coverable)

      if(result == null){
        result = validateFloodCoverageLimits(covTerm, coverable)
      }
    }

    return result
  }

  static function isCovTermEditable(term : gw.api.domain.covterm.DirectCovTerm, coverable : Coverable) : boolean {
    var result = true
    var configResult = ConfigParamsUtil.getBoolean(ConfigParameterType_Ext.TC_ISCOVERAGETERMEDITABLE, coverable.PolicyLine.BaseState, term.PatternCode)

    if(configResult != null){
      result = configResult
    }else if(coverable typeis Dwelling_HOE){
      var min = term.getMinAllowedLimitValue(coverable)
      var max = term.getMaxAllowedLimitValue(coverable)

      result = (min == null and max == null) or min != max
    }

    return result
  }

  static function onCovTermOptionChange(term : gw.api.domain.covterm.CovTerm, coverable : Coverable) {
    onCovTermOptionChange_OnPremisesLimit(term, coverable)
    onCovTermOptionChange_LossAssessmentLimit(term, coverable)

    if(term.PatternCode == "HODW_WindHail_Ded_HOE" and term typeis OptionCovTerm){
      (coverable.PolicyLine as HomeownersLine_HOE).setCoverageConditionOrExclusionExists("HODW_AckNoWindstromHail_HOE_Ext", term.Value == null or term.Value < 0)
    }
  }

  static function getOptionLabel(covTerm : gw.api.domain.covterm.CovTerm, coverable : Coverable) : String{
    var result : String

    if(coverable typeis Dwelling_HOE and covTerm.PatternCode == "HODW_Lossofuse_HOE_Ext"){
      var lossOfUseLabeledPolicyTypes : List<HOPolicyType_HOE> = {TC_HO3, TC_HO6}
      result = (lossOfUseLabeledPolicyTypes.contains((coverable as Dwelling_HOE).HOLine.HOPolicyType)) ? displaykey.una.productmodel.LossOfUse : displaykey.una.productmodel.FairRentalValue
    }else{
      result = covTerm.Pattern.DisplayName
    }

    return result
  }

  private static function validateCalculatedLimits(covTerm: DirectCovTerm, coverable: Dwelling_HOE) : String {
    var result : String

    var min = covTerm.getMinAllowedLimitValue(coverable)
    var max = covTerm.getMaxAllowedLimitValue(coverable)

    if(ConfigParamsUtil.getList(TC_DERIVEDSPECIALLIMITSCOVTERMPATTERNS, coverable.PolicyLine.BaseState).contains(covTerm.PatternCode)){
      var incrementAmount = ConfigParamsUtil.getDouble(TC_SpecialLimitsIncrementAmount, coverable.HOLine.BaseState, covTerm.PatternCode)
      var isAllowedValue = isAllowedValue(incrementAmount, covTerm, coverable)

      if(covTerm.Value != null and covTerm.Value < min or covTerm.Value > max or !isAllowedValue){
        result = displaykey.SpecialLimitErrorMessage(covTerm.Pattern.Name, new Double(min).asMoney(), new Double(max).asMoney(), incrementAmount.asMoney())
      }
    }else{
      if((max != null and min != null) and (covTerm.Value < min or covTerm.Value > max)){
        result = displaykey.una.productmodel.validation.LimitValidationMessage(new Double(covTerm.Value).asMoney(), covTerm.Pattern.Name, new Double(min as double).asMoney(), new Double(max as double).asMoney())
      }else if(min != null and covTerm.Value < min){
        result = displaykey.una.productmodel.validation.LimitMinValidationMessage(new Double(min as double).asMoney())
      }else if(max != null and covTerm.Value > max){
        result = displaykey.una.productmodel.validation.LimitMaxValidationMessage (new Double(max as double).asMoney())
      }
    }

    return result
  }

  private static function validateFloodCoverageLimits(covTerm : DirectCovTerm, coverable : Dwelling_HOE) : String{
    var result : String

    if(covTerm.PatternCode =="HODW_FloodCov_Dwelling_HOE" and coverable.HODW_Dwelling_Cov_HOEExists and coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm != null and coverable.HODW_FloodCoverage_HOE_ExtExists and
        coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCov_Dwelling_HOETerm.Value > coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value){
      result = displaykey.una.productmodel.validation.ValidateFlood_Ext
    }
    if(covTerm.PatternCode == "HODW_CondominiumLossAssessment_HOE" and coverable.HODW_Dwelling_Cov_HOEExists and coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm != null and coverable.HODW_FloodCoverage_HOE_ExtExists and
        coverable.HODW_FloodCoverage_HOE_Ext.HODW_CondominiumLossAssessment_HOETerm.Value > coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value) {
      result = displaykey.una.productmodel.validation.ValidateFlood_Ext
    }

    return  result
  }

  private static function setSectionILimitDefaults(dwelling : Dwelling_HOE, covTerm : DirectCovTerm){
    var patternsToDefault = CoveragesUtil.DEPENDENT_LIMIT_PATTERNS_TO_DERIVING_LIMIT_PATTERNS.get(covTerm.PatternCode)

    if(covTerm.PatternCode == "HODW_PersonalPropertyLimit_HOE" and dwelling.HOPolicyType == TC_HO3){//exclude from re-defaulting when personal property changes
      patternsToDefault.removeWhere( \ pattern -> pattern.equalsIgnoreCase("HODW_LossOfUseDwelLimit_HOE"))
    }

    var limitsToDefault = dwelling.Coverages*.CovTerms.whereTypeIs(DirectCovTerm).where( \ coverageTerm -> patternsToDefault.contains(coverageTerm.PatternCode))
    limitsToDefault.each( \ limit -> limit.setDefaultLimit(dwelling))
  }

  private static function setExecutiveCoverageDefaults(dwelling : Dwelling_HOE, booleanCovTerm : BooleanCovTerm){
    var coveragePatternsToSelect = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTSELECTEDCOVERAGEPATTERNS, dwelling.PolicyLine.BaseState)

    coveragePatternsToSelect.each( \ coveragePattern -> {
      if(dwelling.isCoverageAvailable(coveragePattern)){
        dwelling.setCoverageConditionOrExclusionExists(coveragePattern, booleanCovTerm.Value)
      }else if(dwelling.HOLine.isCoverageAvailable(coveragePattern)){
        dwelling.HOLine.setCoverageConditionOrExclusionExists(coveragePattern, booleanCovTerm.Value)
      }
    })

    if(ConfigParamsUtil.getBoolean(ConfigParameterType_Ext.TC_SHOULDDEFAULTLIMITSEXECUTIVECOVERAGES, dwelling.PolicyLine.BaseState)){
      setExecutiveDefaultsForCoverage(dwelling.Coverages, dwelling, booleanCovTerm.Value)
      setExecutiveDefaultsForCoverage(dwelling.HOLine.AllCoverages, dwelling.HOLine, booleanCovTerm.Value)
    }

    if(booleanCovTerm.Value){
      if(dwelling.HOLine.BaseState == TC_CA or dwelling.HOLine.BaseState == TC_HI){
        dwelling.Coverages*.CovTerms.whereTypeIs(DirectCovTerm).each( \ covTerm -> covTerm.setDefaultLimit(dwelling))
      }
    }
  }

  private static function setExecutiveDefaultsForCoverage(coverages : Coverage[], coverable : Coverable, isExecutiveCoverage : boolean){
    coverages.each( \ coverage -> {
      coverage.CovTerms.each( \ covTerm -> {
        var defaultValue = getExecutiveCoverageDefaultDefault(isExecutiveCoverage, coverable, covTerm)

        if(defaultValue != null){
          setDefaultValueForExecutiveCoverage(covTerm, defaultValue, coverable)
        }else{
          covTerm.setDefaultLimit(covTerm.Clause.OwningCoverable)//re-set default limit if there isn't one from the product model perspective
        }
      })
    })
  }

  private static function getExecutiveCoverageDefaultDefault(isExecutiveCoverage : boolean, coverable : Coverable, covTerm : CovTerm) : String{
    var result : String
    var executiveEndorsementDefault = ConfigParamsUtil.getDouble(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTDEFAULT, coverable.PolicyLine.BaseState, covTerm.PatternCode)

    if(executiveEndorsementDefault != null){//meaning this was a cov term that was defaulted as a result of executive coverage
      if(isExecutiveCoverage){
        result = executiveEndorsementDefault
      }else{
        result = covTerm.Pattern.getDefaultValue(null)
      }
    }

    return result
  }

  private static function setDefaultValueForExecutiveCoverage(covTerm : gw.api.domain.covterm.CovTerm, defaultValue : String, coverable : Coverable){
    if(shouldDefaultExecutivePersonalPropertyLimit(covTerm, coverable)){
      (covTerm as DirectCovTerm).Value = defaultValue as double * (coverable as Dwelling_HOE).HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    }else if(covTerm typeis DirectCovTerm and covTerm.PatternCode != "HODW_PersonalPropertyLimit_HOE"){
      (covTerm as DirectCovTerm).Value = defaultValue
    }else if(covTerm typeis OptionCovTerm){
      var option = covTerm.AvailableOptions.firstWhere( \ opt -> opt.Value == defaultValue)
      covTerm.setOptionValue(option)
    }
  }

  private static function shouldDefaultExecutivePersonalPropertyLimit(covTerm : CovTerm, coverable : Coverable) : boolean{
    return coverable typeis Dwelling_HOE
       and covTerm.PatternCode == "HODW_PersonalPropertyLimit_HOE"
       and (coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value > 0)
  }

  private static function roundInputValue(coverable : Coverable, covTerm: gw.api.domain.covterm.CovTerm){
    var roundingFactor = ConfigParamsUtil.getInt(ConfigParameterType_Ext.TC_ROUNDINGFACTOR, coverable.PolicyLine.BaseState, covTerm.PatternCode)

    if(covTerm.ValueAsString != null and roundingFactor != null){
      var doubleVal = (covTerm as DirectCovTerm).Value.doubleValue()
      var roundedNumber = MathUtil.roundTo(doubleVal, roundingFactor, ROUND_NEAREST)
      (covTerm as DirectCovTerm).Value = roundedNumber
    }
  }

  private static function onCovTermOptionChange_OnPremisesLimit(term : gw.api.domain.covterm.CovTerm, coverable : Coverable ){
    if(term.PatternCode == "HODW_OnPremises_Limit_HOE" and coverable typeis Dwelling_HOE){
      var onPremisesValue = coverable.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.Value
      var factor = ConfigParamsUtil.getDouble(ConfigParameterType_Ext.TC_OFFPREMISESLIMITFACTOR, coverable.PolicyLine.BaseState)

      coverable.HODW_BusinessProperty_HOE_Ext.HODW_OffPremises_Limit_HOETerm.Value = onPremisesValue * factor
    }
  }

  private static function onCovTermOptionChange_LossAssessmentLimit(term : gw.api.domain.covterm.CovTerm, coverable : Coverable){
    if(term.PatternCode == "HOPL_LossAssCovLimit_HOE" and coverable typeis Dwelling_HOE){
      coverable.HODW_LossAssessmentCov_HOE_Ext.setDefaults()
    }
  }

  private static function isAllowedValue(incrementValue : double, covTerm : DirectCovTerm, dwelling : Dwelling_HOE) : boolean {
    var baseState = dwelling.PolicyLine.BaseState
    var minimumAllowed = covTerm.getMinAllowedLimitValue(dwelling)
    var maximumAllowed = covTerm.getMaxAllowedLimitValue(dwelling)

    var allowedIncrement = minimumAllowed
    var allowedIncrements : List<Double> = {allowedIncrement}

    while(allowedIncrement <= maximumAllowed){
      allowedIncrement += incrementValue
      allowedIncrements.add(allowedIncrement)
    }

    if(dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value and covTerm.PatternCode == "HODW_SecurityLimits_HOE"){
      allowedIncrements.add(5000)
    }

    return allowedIncrements.contains(covTerm.Value.doubleValue())
  }

  public static function validateRequiredPIField(dwelling:Dwelling_HOE):String{

     if(dwelling.HODW_PermittedIncOcp_HOE_ExtExists and (dwelling.HOPolicyType == TC_HO3 or dwelling.HOPolicyType == TC_HO6) and
        dwelling.HODW_PermittedIncOcp_HOE_Ext.HODWDwelling_HOETerm.Value == null and
        dwelling.HODW_PermittedIncOcp_HOE_Ext.HODW_OtherStructure_HOETerm.Value == null) {
         return displaykey.Web.Policy.HomeownersLine.Validation.RequiredTerm_Ext
      }
    else if(dwelling.HODW_PermittedIncOcp_HOE_ExtExists and
            dwelling.HODW_PermittedIncOcp_HOE_Ext.HODW_OtherStructure_HOETerm.Value == null and
            dwelling.HOPolicyType == TC_HO4){
       return displaykey.Web.Policy.HomeownersLine.Validation.OSRequired_Ext
     }
    return null
  }
}
