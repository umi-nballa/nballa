package gw.lob.bp7.rating
uses gw.api.productmodel.ClausePattern
uses gw.lob.common.util.DateRange
uses java.util.Map

class BP7LiabilityLessorStep extends BP7RatingStep {
  
  var _building : BP7Building
  
  construct(line : BP7Line, building : BP7Building, executor : BP7RateRoutineExecutor, daysInTerm : int) {
    super(line, executor, daysInTerm)
    _building = building
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7BusinessLiability" : return "BP7LiabilityLessor_PC"
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {    
    return 
    {TC_POLICYLINE         -> _line,
     TC_COVERAGE           -> coverage,
     TC_BUILDING           -> _building,
     TC_CLASSIFICATION     -> _building.PredominantClassification
    }
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData = new BP7LiabilityLessorCovCostData(_building, coverage, sliceToRate)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

}
