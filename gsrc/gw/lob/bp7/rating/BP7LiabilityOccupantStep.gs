package gw.lob.bp7.rating
uses gw.api.productmodel.ClausePattern
uses gw.lob.common.util.DateRange
uses java.util.Map

class BP7LiabilityOccupantStep extends BP7RatingStep {
  
  var _classification : BP7Classification
  
  construct(line : BP7Line, classification : BP7Classification, executor : BP7RateRoutineExecutor, daysInTerm : int) {
    super(line, executor, daysInTerm)
    _classification = classification
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7BusinessLiability" : return "BP7LiabilityOccupant_PC"
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {    
    return 
    {TC_POLICYLINE         -> _line,
     TC_COVERAGE           -> coverage,
     TC_CLASSIFICATION     -> _classification
    }
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData = new BP7LiabilityOccupantCovCostData(_classification, coverage, sliceToRate)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

}
