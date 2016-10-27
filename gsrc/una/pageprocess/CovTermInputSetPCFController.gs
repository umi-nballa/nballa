package una.pageprocess

uses gw.web.productmodel.ProductModelSyncIssuesHandler
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.BooleanCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.CovTerm
uses java.lang.Double
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController.CovTermDefaultContext

/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/3/16
 * Time: 8:55 AM
 * To change this template use File | Settings | File Templates.
 */
class CovTermInputSetPCFController {

  // Sen Pitchaimuthu: Added onchange function to calculate the Other Structure, Personal Property and Loss of use
  // coverages based on Dwelling Coverage
  static function onchange(coverable: Coverable, _covTerm: gw.api.domain.covterm.CovTerm){
    switch(typeof coverable){
      case Dwelling_HOE:
          onChangeForDwellingCoverable(coverable, _covTerm)
          break
        default:
        break
    }
  }

  private static function onChangeForDwellingCoverable(dwelling : Dwelling_HOE, covTerm : CovTerm){
    dwelling.PolicyPeriod.editIfQuoted()
    ProductModelSyncIssuesHandler.syncCoverages(dwelling.PolicyPeriod.Lines*.AllCoverables, null)

    if(covTerm typeis DirectCovTerm){
      covTerm.round(ROUND_NEAREST)
    }

    switch(covTerm.PatternCode) {
      case "HODW_Dwelling_Limit_HOE":
        dwelling.HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm?.onInit()
        dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovA_HOETerm?.onInit()
        dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovD_HOE_ExtTerm?.onInit()
        new CoverageTermsRuntimeDefaultController ().setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, covTerm))
        break
      case "DPDW_Dwelling_Limit_HOE":
        dwelling.HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm?.onInit()
        new CoverageTermsRuntimeDefaultController ().setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, covTerm))
        break
      case "HODW_PersonalPropertyLimit_HOE":
        new CoverageTermsRuntimeDefaultController ().setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, covTerm))
        break
      case "HODW_ExecutiveCov_HOE_Ext":
        setExecutiveCoverageDefaults(dwelling, covTerm as BooleanCovTerm)
        break
      case "HODW_OtherPerils_Ded_HOE":
        dwelling.HOLine.HOLI_UnitOwnersRentedtoOthers_HOE_Ext.HOLI_UnitOwnersRentedOthers_Deductible_HOE_ExtTerm?.onInit()
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

  static function onCovTermOptionChange(term : gw.api.domain.covterm.CovTerm, coverable : Coverable) {
    onCovTermOptionChange_OnPremisesLimit(term, coverable)

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
  private static function setExecutiveCoverageDefaults(dwelling : Dwelling_HOE, booleanCovTerm : BooleanCovTerm){
    var coveragePatternsToSelect = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTSELECTEDCOVERAGEPATTERNS, dwelling.PolicyLine.BaseState)


    coveragePatternsToSelect.each( \ coveragePattern -> {
      if(dwelling.isCoverageAvailable(coveragePattern)){
        toggleCoveragesExistenceForExecutiveCoverage(dwelling, booleanCovTerm.Value, coveragePattern)
      }else if(dwelling.HOLine.isCoverageAvailable(coveragePattern)){
        toggleCoveragesExistenceForExecutiveCoverage(dwelling.HOLine, booleanCovTerm.Value, coveragePattern)
      }
    })

    if(booleanCovTerm.Value){
      CoverageTermsRuntimeDefaultController.setDefaults(new CovTermDefaultContext(EXECUTIVE_COVERAGE, dwelling))
    }else{//reset defaults to non-executive coverage
      var executiveCoverageDefaultPatterns = ConfigParamsUtil.getList(TC_DefaultedExecutiveCoveragePatterns, dwelling.PolicyLine.BaseState)
      var executiveCoverageCovTerms = dwelling.PolicyLine.AllCoverables*.CoveragesFromCoverable*.CovTerms.where( \ covTerm -> executiveCoverageDefaultPatterns?.contains(covTerm.PatternCode))

      executiveCoverageCovTerms.each( \ covTerm -> covTerm.setValueFromString(covTerm.Pattern.getDefaultValue(null)))
      executiveCoverageCovTerms.each( \ covTerm -> covTerm.onInit())
      CoverageTermsRuntimeDefaultController.setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, {"HODW_PersonalPropertyLimit_HOE"}))
    }
  }

  private static function toggleCoveragesExistenceForExecutiveCoverage(coverable : Coverable, isExecutiveCoverage : boolean, patternCode : String){
    if(isExecutiveCoverage){
      coverable.setCoverageConditionOrExclusionExists(patternCode, isExecutiveCoverage)
    }else{
      var coverageExistence = coverable.getCoverage(patternCode).Pattern.getExistence(coverable)
      if(coverageExistence == TC_ELECTABLE){
        coverable.setCoverageConditionOrExclusionExists(patternCode, isExecutiveCoverage)
      }
    }
  }

  private static function onCovTermOptionChange_OnPremisesLimit(term : gw.api.domain.covterm.CovTerm, coverable : Coverable ){
    if(term.PatternCode == "HODW_OnPremises_Limit_HOE" and coverable typeis Dwelling_HOE){
      var onPremisesValue = coverable.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.Value
      var factor = ConfigParamsUtil.getDouble(ConfigParameterType_Ext.TC_OFFPREMISESLIMITFACTOR, coverable.PolicyLine.BaseState)

      coverable.HODW_BusinessProperty_HOE_Ext.HODW_OffPremises_Limit_HOETerm.Value = onPremisesValue * factor
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
