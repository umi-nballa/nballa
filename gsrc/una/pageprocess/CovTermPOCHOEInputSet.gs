package una.pageprocess

uses gw.web.productmodel.ProductModelSyncIssuesHandler
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.BooleanCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses una.utils.MathUtil

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
  static function onchange(_coverable: Coverable, _covTerm: gw.api.domain.covterm.CovTerm)
  {
    var dwelling = _coverable as Dwelling_HOE
    dwelling.PolicyPeriod.editIfQuoted()
    ProductModelSyncIssuesHandler.syncCoverages(dwelling.PolicyPeriod.Lines*.AllCoverables, null)

    switch(_covTerm.PatternCode) {
        case "HODW_Dwelling_Limit_HOE":
              dwelling.HODW_Dwelling_Cov_HOE.setHomeownersDefaultLimits_Ext()
              break
        case "DPDW_Dwelling_Limit_HOE" :
            dwelling.DPDW_Dwelling_Cov_HOE.setDwellingDefaultLimits_Ext()
              break
        case "HODW_ExecutiveCov_HOE_Ext":
          setExecutiveCoverageDefaults(_coverable as Dwelling_HOE, _covTerm as BooleanCovTerm)
          break
        default:
          break;
     }

    roundInputValue(_coverable, _covTerm)
  }

  static function isCovTermEditable(term : gw.api.domain.covterm.CovTerm, coverable : Coverable) : boolean {
    var result = true
    var configResult = ConfigParamsUtil.getBoolean(ConfigParameterType_Ext.TC_ISCOVERAGETERMEDITABLE, coverable.PolicyLine.BaseState, term.PatternCode)

    if(configResult != null){
      result = configResult
    }

    return result
  }

  static function onCovTermOptionChange(term : gw.api.domain.covterm.CovTerm, coverable : Coverable) {
    onCovTermOptionChange_OnPremisesLimit(term, coverable)
    onCovTermOptionChange_LossAssessmentLimit(term, coverable)
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

  private static function setExecutiveCoverageDefaults(dwelling : Dwelling_HOE, booleanCovTerm : BooleanCovTerm){

    if(booleanCovTerm.Value == true){
      var coveragePatternsToSelect = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTSELECTEDCOVERAGEPATTERNS, dwelling.PolicyLine.BaseState)

      coveragePatternsToSelect.each( \ coveragePattern -> {
        if(dwelling.isCoverageAvailable(coveragePattern)){
          dwelling.setCoverageConditionOrExclusionExists(coveragePattern, true)
        }else if(dwelling.HOLine.isCoverageAvailable(coveragePattern)){
          dwelling.HOLine.setCoverageConditionOrExclusionExists(coveragePattern, true)
        }
      })

      setExecutiveDefaultsForCoverage(dwelling.Coverages, dwelling)
      setExecutiveDefaultsForCoverage(dwelling.HOLine.AllCoverages, dwelling.HOLine)
    }
  }

  private static function setExecutiveDefaultsForCoverage(coverages : Coverage[], coverable : Coverable){
    coverages.each( \ coverage -> {
      coverage.CovTerms.each( \ covTerm -> {
        var defaultValue = ConfigParamsUtil.getDouble(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTDEFAULT, coverable.PolicyLine.BaseState, covTerm.PatternCode)

        if(defaultValue != null){
          setDefaultValueForExecutiveCoverage(covTerm, defaultValue, coverable)
        }else if(covTerm.PatternCode == "HODW_PropertyValuation_HOE"){
          covTerm.setValueFromString("Replacement")
        }
      })
    })
  }

  private static function setDefaultValueForExecutiveCoverage(covTerm : gw.api.domain.covterm.CovTerm, defaultValue : double, coverable : Coverable){
    if(coverable typeis HomeownersLine_HOE and covTerm.PatternCode == "HODW_PersonalPropertyLimit_HOE" and coverable.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null){
      (covTerm as DirectCovTerm).Value = defaultValue * coverable.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    }else if(covTerm typeis DirectCovTerm){
      (covTerm as DirectCovTerm).Value = defaultValue
    }else if(covTerm typeis OptionCovTerm){
      var option = covTerm.AvailableOptions.atMostOneWhere( \ option -> option.Value.doubleValue() == defaultValue)
      covTerm.setOptionValue(option)
    }
  }

  private static function roundInputValue(coverable : Coverable, covTerm: gw.api.domain.covterm.CovTerm){
    var roundingFactor = ConfigParamsUtil.getInt(ConfigParameterType_Ext.TC_ROUNDINGFACTOR, coverable.PolicyLine.BaseState, covTerm.PatternCode)

    if(covTerm.ValueAsString != null and roundingFactor != null){
      var doubleVal = (covTerm as DirectCovTerm).Value.doubleValue()
      var roundedNumber = MathUtil.roundTo(doubleVal, roundingFactor)
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
    if(term.PatternCode == "HOPL_LossAssCovLimit_HOE" and coverable typeis HomeownersLine_HOE){
      coverable.HODW_LossAssessmentCov_HOE_Ext.setDefaults()
    }
  }
}