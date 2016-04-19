package gw.lob.bp7.rating
uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.common.util.DateRange

class BP7BuildingStep extends BP7RatingStep {
  
  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int) {
    super(line, executor, daysInTerm)
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7Structure" : return "BP7Building_PC"
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return 
    {TC_POLICYLINE         -> _line,
     TC_COVERAGE           -> coverage,
     TC_BUILDING           -> coverage.OwningCoverable}
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData : BP7CostData
    if (coverage typeis BP7Structure and coverage.InBlanket) {
      costData = new BP7BlanketedBuildingCovCostData(coverage.Blanket, coverage, sliceToRate)
    }
    else {
      costData = new BP7BuildingCovCostData(coverage, sliceToRate)
    }
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

}
