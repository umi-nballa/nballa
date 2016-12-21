package gw.lob.bp7.rating

uses gw.api.productmodel.ClausePattern
uses gw.lob.common.util.DateRange
uses java.util.Map
uses una.rating.bp7.ratinginfos.BP7RatingInfo
uses una.rating.bp7.ratinginfos.BP7ClassificationRatingInfo

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
      case "BP7SpoilgCov" : return "BP7SpoilageCoverageRateRoutine"
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }    
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return 
    {TC_POLICYLINE         -> _line,
     TC_RATINGINFO         -> _bp7RatingInfo,
     TC_CLASSIFICATIONRATINGINFO  -> _classificationRatingInfo}
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

}
