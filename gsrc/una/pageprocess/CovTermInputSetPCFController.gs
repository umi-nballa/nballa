package una.pageprocess

uses gw.web.productmodel.ProductModelSyncIssuesHandler
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.BooleanCovTerm
uses java.lang.Double
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController
uses una.productmodel.runtimedefaults.CoverageTermsRuntimeDefaultController.CovTermDefaultContext
uses java.math.BigDecimal
uses gw.api.domain.covterm.OptionCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: spitchaimuthu
 * Date: 5/3/16
 * Time: 8:55 AM
 * To change this template use File | Settings | File Templates.
 */
class CovTermInputSetPCFController {
  static function onChange(covTerm: gw.api.domain.covterm.CovTerm){
    var coverable = covTerm.Clause.OwningCoverable

    //sync coverages
    ProductModelSyncIssuesHandler.syncCoverages(coverable.PolicyLine.AllCoverables, null)

    if(coverable typeis Dwelling_HOE or coverable typeis HomeownersLine_HOE){
      if(covTerm typeis DirectCovTerm){
        onChangeDirectCovTerm(covTerm)
      }else if(covTerm typeis OptionCovTerm){
        onChangeOptionCovTerm(covTerm)
      }else if(covTerm typeis BooleanCovTerm){
        onChangeBooleanCovTerm(covTerm)
      }
    }else if(coverable typeis CPBuilding){
      if(covTerm.PatternCode == "SinkholeLimit_EXT"){
        una.productmodel.CPAutoPopulateUtil.setTermValue(covTerm)
      }
    }
  }

  static function validate(coverable: Coverable, covTerm: gw.api.domain.covterm.DirectCovTerm):String{    
    var result : String

    if(coverable typeis Dwelling_HOE){
      if(covTerm.PatternCode == "HODW_BuildAddInc_HOE"){
        result = validateBuildAddAltLimits(covTerm, coverable)
      }else if(covTerm.PatternCode == "HODW_CondominiumLossAssessment_HOE" or covTerm.PatternCode == "HODW_DebrisRemoval_HOE"){
        result = validateFloodCoverageLimits(covTerm, coverable)
      }else{
        result = validateCalculatedLimits(covTerm, coverable)
      }
    }else if(coverable typeis BP7BusinessOwnersLine || coverable typeis BP7Building || coverable typeis BP7Classification){
      result = isCovTermAllowedValue(covTerm)
    }

    return result
  }

  private static function onChangeOptionCovTerm(term : OptionCovTerm) {
    var coverable = term.Clause.OwningCoverable
    var hoLine : entity.HomeownersLine_HOE

    if(coverable typeis Dwelling_HOE){
      hoLine = coverable.HOLine
    }else if(coverable typeis entity.HomeownersLine_HOE){
      hoLine = coverable
    }

    onChangeOptionCovTerm_OnPremisesLimit(term)

    if(hoLine != null){
      if(term.PatternCode == "HODW_WindHail_Ded_HOE"){
        hoLine.setCoverageConditionOrExclusionExists("HODW_AckNoWindstromHail_HOE_Ext", term.Value == null or term.Value < 0)
      }else if(term.PatternCode == "HOPL_LossAssCovLimit_HOE" and hoLine.Dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value > 2000bd){
        if(hoLine.HOPolicyType == TC_HO6 and hoLine.Dwelling.HODW_LossAssessmentCov_HOE_Ext.HasHOPL_Deductible_HOETerm){
          hoLine.Dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_Deductible_HOETerm.Value = hoLine.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
        }else if(hoLine.HOPolicyType == TC_DP3_Ext and hoLine.Dwelling.ResidenceType == TC_CONDO){
          hoLine.Dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_Deductible_HOETerm.Value = 250bd
        }
      }else if(term.PatternCode == "DPLI_LiabilityLimit_HOE" or term.PatternCode == "HOLI_Liability_Limit_HOE"){
        var availableOptions = hoLine.HOLI_PersonalInjury_HOE.HOLI_PersonalInjuryLimit_HOE_ExtTerm.AvailableOptions
        var matchingValue = availableOptions?.atMostOneWhere( \ option -> option.Value?.doubleValue() == term.Value?.doubleValue())

        if(matchingValue != null){
          hoLine.HOLI_PersonalInjury_HOE.HOLI_PersonalInjuryLimit_HOE_ExtTerm.setOptionValue(matchingValue)
        }
      }else if(term.PatternCode == "HODW_OtherPerils_Ded_HOE"){
        hoLine.Dwelling.HODW_SinkholeLoss_HOE_Ext.HODW_SinkholeLossDeductible_ExtTerm?.onInit()
      }
    }
  }

  private static function onChangeDirectCovTerm(term : DirectCovTerm) {
    var dwelling : Dwelling_HOE

    if(term.Clause.OwningCoverable typeis Dwelling_HOE){
      dwelling = term.Clause.OwningCoverable
    }

    term.round(ROUND_NEAREST)

    switch(term.PatternCode) {
      case "HODW_Dwelling_Limit_HOE":
        dwelling.HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm?.onInit()
        dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovA_HOETerm?.onInit()
        dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovD_HOE_ExtTerm?.onInit()
        dwelling.HODW_SinkholeLoss_HOE_Ext.HODW_SinkholeLossDeductible_ExtTerm?.onInit()
        new CoverageTermsRuntimeDefaultController ().setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, term))

        if((term.Clause.OwningCoverable as Dwelling_HOE).HOPolicyType == TC_HO3){
          dwelling.HODW_SinkholeLoss_HOE_Ext.HODW_SinkholeLossDeductible_ExtTerm?.onInit()
        }
        break
      case "DPDW_Dwelling_Limit_HOE":
        dwelling.HODW_Limited_Earthquake_CA_HOE.HODW_EQDwellingLimit_HOE_ExtTerm?.onInit()
        dwelling.HODW_SinkholeLoss_HOE_Ext.HODW_SinkholeLossDeductible_ExtTerm?.onInit()
        new CoverageTermsRuntimeDefaultController ().setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, term))
        break
      case "HODW_PersonalPropertyLimit_HOE":
        new CoverageTermsRuntimeDefaultController().setDefaults(new CovTermDefaultContext(SECTION_I, dwelling, term))
        dwelling.HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm?.onInit()
        break
      case "HODW_OtherStructures_Limit_HOE":
        var hoPolicyType = (term.Clause.OwningCoverable as Dwelling_HOE).HOPolicyType
        if(hoPolicyType == TC_HO6 or hoPolicyType == TC_HO4 or hoPolicyType == TC_DP3_Ext){
          dwelling.HODW_SinkholeLoss_HOE_Ext.HODW_SinkholeLossDeductible_ExtTerm?.onInit()
        }
        break
      default:
        break
    }
  }

  private static function onChangeBooleanCovTerm(term : BooleanCovTerm){
    var coverable = term.Clause.OwningCoverable

    switch(term.PatternCode){
      case "HODW_OtherStructure_HOE":
        (coverable as Dwelling_HOE).HODW_PermittedIncOcp_HOE_Ext.HODWDwelling_HOETerm?.setValue(!term.Value)
        break
      case "HODWDwelling_HOE":
        (coverable as Dwelling_HOE).HODW_PermittedIncOcp_HOE_Ext.HODW_OtherStructure_HOETerm?.setValue(!term.Value)
         ProductModelSyncIssuesHandler.syncSpecifiedCoverages({(coverable as Dwelling_HOE).HODW_PermittedIncOcp_HOE_Ext}, null)
        break
      case "HODW_ExecutiveCov_HOE_Ext":
        setExecutiveCoverageDefaults((coverable as Dwelling_HOE), term)
        break
      default:
        break
    }
  }

  static function getOptionLabel(covTerm : gw.api.domain.covterm.CovTerm) : String{
    var result : String

    if(covTerm.Clause.OwningCoverable typeis Dwelling_HOE and covTerm.PatternCode == "HODW_Lossofuse_HOE_Ext"){
      var lossOfUseLabeledPolicyTypes : List<HOPolicyType_HOE> = {TC_HO3, TC_HO6}
      result = (lossOfUseLabeledPolicyTypes.contains(covTerm.Clause.OwningCoverable.HOLine.HOPolicyType)) ? displaykey.una.productmodel.LossOfUse : displaykey.una.productmodel.FairRentalValue
    }else if(covTerm.PatternCode == "HODW_ElectronicApparatusLimit_HOE" and covTerm.Clause.OwningCoverable.PolicyLine.BaseState == TC_NC){
      result = displaykey.una.coverages.electronic_aparatus_name_NC
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
    var maxValue: BigDecimal=250000

    if(covTerm.PatternCode == "HODW_CondominiumLossAssessment_HOE" or covTerm.PatternCode == "HODW_DebrisRemoval_HOE"){
      if(coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value != null){
        if(covTerm.Value > coverable.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value){
          result = displaykey.una.productmodel.validation.ValidateFlood_Ext
        }else if(covTerm.Value > maxValue){
          result = displaykey.una.productmodel.validation.maxValueFloodcov_Ext(new Double(maxValue as double).asMoney())
        }
      }
    }

    return  result
  }

  private static function setExecutiveCoverageDefaults(dwelling : Dwelling_HOE, booleanCovTerm : BooleanCovTerm){
    var coveragePatternsToSelect = ConfigParamsUtil.getList(ConfigParameterType_Ext.TC_EXECUTIVEENDORSEMENTSELECTEDCOVERAGEPATTERNS, dwelling.PolicyLine.BaseState)


    coveragePatternsToSelect.each( \ coveragePattern -> {
      var pattern = coveragePattern
      if(dwelling.isCoverageAvailable(coveragePattern)){
        toggleCoveragesExistenceForExecutiveCoverage(dwelling, booleanCovTerm.Value, coveragePattern)
      }else if(dwelling.HOLine.isCoverageAvailable(coveragePattern)){
        toggleCoveragesExistenceForExecutiveCoverage(dwelling.HOLine, booleanCovTerm.Value, coveragePattern)
      }
    })

    if(booleanCovTerm.Value){
      CoverageTermsRuntimeDefaultController.setDefaults(new CovTermDefaultContext(EXECUTIVE_COVERAGE, dwelling))

      if(dwelling.HODW_Personal_Property_HOEExists){
        dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOE_ExtTerm.Value = TC_PersProp_ReplCost
      }
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
      if(coverable.hasCoverage(patternCode) == true){
        var coverageExistence = coverable.getCoverage(patternCode).Pattern.getExistence(coverable)
        if(coverageExistence == TC_ELECTABLE){
          coverable.setCoverageConditionOrExclusionExists(patternCode, isExecutiveCoverage)
        }
      }
    }
  }

  private static function onChangeOptionCovTerm_OnPremisesLimit(term: gw.api.domain.covterm.CovTerm){
    var coverable = term.Clause.OwningCoverable

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

  private static function validateBuildAddAltLimits(covTerm : DirectCovTerm, coverable : Dwelling_HOE) : String{
    var result : String
    var factor : BigDecimal = 0.1
    var value : BigDecimal = 10

    if(covTerm.PatternCode == "HODW_BuildAddInc_HOE" and coverable.HODW_Personal_Property_HOEExists and
       coverable.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null and
       coverable.HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm.Value< coverable.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value.multiply(factor)) {
      result = displaykey.una.productmodel.validation.MinValidateBuildAlt_Ext(value)
    }else if (covTerm.PatternCode == "HODW_BuildAddInc_HOE" and coverable.HODW_Personal_Property_HOEExists and
        coverable.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value != null and
        coverable.HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm.Value > coverable.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value) {
      result = displaykey.una.productmodel.validation.MaxValidateBuilAlt_Ext
    }

    return  result
  }

  // BOP/BP7 DirectCovTerm increment of 1000 validation method
  private static function isCovTermAllowedValue(covTerm : DirectCovTerm):String{
    var result:String
    var minimumAllowed = covTerm.getMinAllowedLimitValue(covTerm.Clause.OwningCoverable)
    var allowedIncrement = minimumAllowed
    var allowedIncrements : List<BigDecimal> = {allowedIncrement}
    if(covTerm.PatternCode=="BP7LimitatDescribedPremises_EXT" || covTerm.PatternCode=="BP7LimitDescribedPremises_EXT" || covTerm.PatternCode=="BP7Limit38" || covTerm.PatternCode=="Limit" ||
        covTerm.PatternCode=="Limit_EXT"){
      if((covTerm.Value).remainder(1000)!=0){
        result = displaykey.una.productmodel.validation.AllowedLimitValidationMessage(covTerm.Clause.Pattern.DisplayName,covTerm.DisplayName)
      }
    }
    return result
  }
}
