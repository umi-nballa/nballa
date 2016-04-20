package gw.lob.bp7.rating

uses java.util.Map
uses gw.rating.CostData
uses gw.lob.common.util.DateRange
uses gw.api.productmodel.ClausePattern

abstract class BP7RatingStep {

  protected var _line : BP7Line
  protected var _executor : BP7RateRoutineExecutor
  protected var _daysInTerm : int
   
  construct(line : BP7Line, executor : BP7RateRoutineExecutor, daysInTerm : int) {
    _line = line
    _executor = executor 
    _daysInTerm = daysInTerm
  }

  function rate(coverage : Coverage, sliceToRate : DateRange) : CostData<Cost, PolicyLine> {
    var costData = createCostData(coverage, sliceToRate)
    var parameterSet = createParameterSet(coverage, costData)

    _executor.execute(getRateRoutineCode(coverage.Pattern), coverage, parameterSet, costData)
   
    return costData
  }
  
  abstract protected function getRateRoutineCode(coveragePattern : ClausePattern) : String
  abstract protected function createParameterSet(coverage : Coverage, costData : BP7CostData) :  Map<CalcRoutineParamName, Object>
  abstract protected function createCostData(coverage : Coverage, sliceToRate : DateRange) : BP7CostData

}
