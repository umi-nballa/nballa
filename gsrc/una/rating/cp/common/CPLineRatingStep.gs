package una.rating.cp.common

uses gw.lob.common.util.DateRange
uses gw.financials.PolicyPeriodFXRateCache
uses gw.api.util.JurisdictionMappingUtil
uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.cp.rating.CPCostData
uses gw.rating.CostData
uses una.rating.cp.costdatas.CPLineCovGroup1CostData
uses una.rating.cp.ratinginfos.CPLineRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswam007
 * Date: 2/14/17
 */
class CPLineRatingStep {
  var _line: CPLine
  var _executor: CPRateRoutineExecutor
  var _daysInTerm: int
  var _rateCache: PolicyPeriodFXRateCache
  private final var GROUPI_RATE_ROUTINE = "GROUPI_RATE_ROUTINE"
  private final var GROUPII_RATE_ROUTINE = "GROUPII_RATE_ROUTINE"
  var _lineRatingInfo : CPLineRatingInfo as LineRatingInfo

  construct(line: CPLine, executor: CPRateRoutineExecutor, daysInTerm: int, rateCache: PolicyPeriodFXRateCache) {
    _line = line
    _executor = executor
    _daysInTerm = daysInTerm
    _rateCache = rateCache
    _lineRatingInfo = new CPLineRatingInfo(line)
  }

  /**
  *   Return all the line coverage rate routines
   */
  function getLineCovRoutinesToGroupMapping(coveragePattern: ClausePattern): Map<String, String> {
    switch (coveragePattern) {
      case "CPTerrorismCoverage_EXT":
          return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_TERRORISM_GROUPI_RATE_ROUTINE}
        default:
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  /**
   * function to rate the CP Line coverages
   */
  function rateLineCoverage(lineCov: CommercialPropertyCov, sliceToRate: DateRange): List<CostData<Cost, PolicyLine>> {
    var state = JurisdictionMappingUtil.getJurisdiction(lineCov.CPLine.CPLocations.first().Location)
    var costData : CPCostData = null
    var costDataList : List<CostData<Cost, PolicyLine>> = {}
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    var routinesToExecute = getLineCovRoutinesToGroupMapping(lineCov.Pattern)
    for(rateRoutineKey in routinesToExecute.Keys){
      if(rateRoutineKey == GROUPI_RATE_ROUTINE){
        costData = new CPLineCovGroup1CostData(sliceToRate.start, sliceToRate.end, lineCov.Currency, _rateCache, lineCov.FixedId, state)
      }
      rateRoutineParameterMap = createLineParameterSet(costData)
      costData.init(_line)
      costData.NumDaysInRatedTerm = _daysInTerm
      _executor.execute(routinesToExecute.get(rateRoutineKey), lineCov, rateRoutineParameterMap, costData)
      if(costData != null){
        costData.copyStandardColumnsToActualColumns()
        costDataList.add(costData)
      }
    }
    return costDataList
  }

  /**
   * creates the Group I parameter set with line rating infos
   */
  private function createLineParameterSet(costData: CPCostData<CPCost>): Map<CalcRoutineParamName, Object> {
    return {TC_POLICYLINE         -> _line,
            TC_LINERATINGINFO_EXT -> _lineRatingInfo,
            TC_COSTDATA           -> costData}
  }

}