package una.rating.bp7.common

uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.common.util.DateRange

uses java.util.Map
uses gw.lob.bp7.rating.BP7RatingStep
uses gw.lob.bp7.rating.BP7RateRoutineExecutor
uses gw.lob.bp7.rating.BP7CostData
uses gw.lob.bp7.rating.BP7LineCovCostData

class BP7LineStep extends BP7RatingStep {
  
  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int) {
    super(line, executor, daysInTerm)
  }

  override function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "BP7CyberOneCov_EXT" : return "BP7CyberOneCoverageRateRoutine"
      case "IdentityRecovCoverage_EXT" : return "BP7IdentityRecoveryCoverageRateRoutine"
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  override function createParameterSet(coverage : Coverage, costData : BP7CostData<BP7Cost>) : Map<CalcRoutineParamName, Object> {
    return
    {TC_POLICYLINE         -> _line,
     TC_COSTDATA -> costData}
  }

  override function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData<BP7Cost> {
    var costData = new BP7LineCovCostData(coverage, sliceToRate)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    return costData
  }

}
