package gw.lob.bp7.rating

uses gw.api.productmodel.ClausePattern
uses gw.lob.common.util.DateRange
uses java.util.Map
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses una.rating.bp7.ratinginfos.BP7ClassificationRatingInfo
uses una.rating.bp7.common.BP7RateRoutineNames
uses una.rating.bp7.ratinginfos.BP7BusinessPersonalPropertyRatingInfo
uses gw.rating.CostData

class BP7ClassificationStep extends BP7RatingStep {

  var _bp7RatingInfo : BP7RatingInfo
  var _classificationRatingInfo : BP7ClassificationRatingInfo

  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int, bp7RatingInfo : BP7RatingInfo, classificationRatingInfo : BP7ClassificationRatingInfo) {
    super(line, executor, daysInTerm)
    _bp7RatingInfo = bp7RatingInfo
    _classificationRatingInfo = classificationRatingInfo
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7SpoilgCov" : return BP7RateRoutineNames.BP7_SPOILAGE_COVERAGE_RATE_ROUTINE
      case "BP7ClassificationAccountsReceivable" : return BP7RateRoutineNames.BP7_CLASSIFICATION_ACCOUNTS_RECEIVABLE_RATE_ROUTINE
      case "BP7ClassificationValuablePapers" : return BP7RateRoutineNames.BP7_CLASSIFICATION_VALUABLE_PAPERS_RATE_ROUTINE
      case "BP7CondoCommlUnitOwnersOptionalCovsLossAssess" : return BP7RateRoutineNames.BP7_CONDO_COMML_UNIT_OWNERS_LOSS_ASSESSMENT_RATE_ROUTINE
      case "BP7CondoCommlUnitOwnersOptionalCovMiscRealProp" : return BP7RateRoutineNames.BP7_CONDO_COMML_UNIT_OWNERS_MISC_REAL_PROPERTY_RATE_ROUTINE
      case "BP7ClassificationBusinessIncomeFromDependentProps" : return BP7RateRoutineNames.BP7_CLASSIFICATION_BI_DEPENDENT_PROPERTIES_RATE_ROUTINE
      case "BP7ClassificationBusinessPersonalProperty" : return BP7RateRoutineNames.BP7_CLASSIFICATION_BUSINESS_PERSONAL_PROPERTY_RATE_ROUTINE
      case "BP7BarbersBeauticiansProfessionalLiability_EXT" : return BP7RateRoutineNames.BP7_BARBERS_BEAUTICIANS_PROFESSIONAL_LIABILITY_RATE_ROUTINE
      case "BP7FuneralDirectorsProflLiab_EXT" : return BP7RateRoutineNames.BP7_FUNERAL_DIRECTORS_PROFESSIONAL_LIABILITY_RATE_ROUTINE
      case "BP7OptProfLiabCov_EXT" : return BP7RateRoutineNames.BP7_OPT_PROFESSIONAL_LIABILITY_RATE_ROUTINE
      case "BP7HearingAidSvcsProfLiab_EXT" : return BP7RateRoutineNames.BP7_HEARING_AID_SERVICES_PROFESSIONAL_LIABILITY_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }    
  }

  function rateBP7BusinessPersonalProperty(coverage : BP7ClassificationBusinessPersonalProperty, sliceToRate : DateRange, businessPersonalPropertyRatingInfo : BP7BusinessPersonalPropertyRatingInfo) : CostData<Cost, PolicyLine> {
    var costData = createCostData(coverage, sliceToRate)
    var parameterSet = createParameterSetForBP7BPP(coverage, costData, businessPersonalPropertyRatingInfo)
    _executor.execute(getRateRoutineCode(coverage.Pattern), coverage, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  override function rate(coverage : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine> {
    var costData = createCostData(coverage, sliceToRate)
    var parameterSet = createParameterSet(coverage, costData)
    _executor.execute(getRateRoutineCode(coverage.Pattern), coverage, parameterSet, costData)
    costData.PremiumNoCTR_Ext = _bp7RatingInfo.PremiumNoCTR
    costData.ActualCalculatedTermAmount_Ext = _bp7RatingInfo.ActualCalculatedAmount
    _bp7RatingInfo.ActualCalculatedAmount = 0.0
    _bp7RatingInfo.PremiumNoCTR = 0.0
    return costData
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return 
    {TC_POLICYLINE         -> _line,
     TC_RATINGINFO         -> _bp7RatingInfo,
     TC_CLASSIFICATIONRATINGINFO  -> _classificationRatingInfo,
     TC_COSTDATA           -> costData}
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData : BP7CostData
    if (coverage typeis BP7ClassificationBusinessPersonalProperty and coverage.InBlanket) {
      costData = new BP7BlanketedClassificationCovCostData(coverage.Blanket, coverage, sliceToRate)
    }
    else {
      costData = new BP7ClassificationCovCostData(coverage, sliceToRate)
    }
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

  function createParameterSetForBP7BPP(coverage : Coverage, costData : BP7CostData<BP7Cost>, businessPersonalPropertyRatingInfo : BP7BusinessPersonalPropertyRatingInfo) : Map<CalcRoutineParamName, Object> {
    return
        {TC_POLICYLINE         -> _line,
         TC_RATINGINFO         -> _bp7RatingInfo,
         TC_CLASSIFICATIONRATINGINFO  -> businessPersonalPropertyRatingInfo,
         TC_COSTDATA           -> costData}
  }

}
