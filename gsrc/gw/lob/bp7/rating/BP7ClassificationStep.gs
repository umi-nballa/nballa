package gw.lob.bp7.rating

uses gw.api.productmodel.ClausePattern
uses gw.lob.common.util.DateRange
uses java.util.Map

class BP7ClassificationStep extends BP7RatingStep {
  
  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int) {
    super(line, executor, daysInTerm)
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7ClassificationBusinessPersonalProperty" : return "BP7ClassificationBPP_PC"
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }    
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return 
    {TC_POLICYLINE         -> _line,
     TC_COVERAGE           -> coverage,
     TC_CLASSIFICATION     -> coverage.OwningCoverable}   
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
