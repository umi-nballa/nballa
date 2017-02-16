package una.rating.cp.common

uses una.rating.cp.CPRateRoutineExecutor
uses gw.lob.cp.rating.CPBuildingCovGroup2CostData
uses gw.lob.common.util.DateRange
uses gw.financials.PolicyPeriodFXRateCache
uses gw.api.util.JurisdictionMappingUtil
uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.cp.rating.CPCostData
uses gw.rating.CostData

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswam007
 * Date: 2/14/17
 */
class CPRatingStep {

  var _line : CPLine
  var _executor : CPRateRoutineExecutor
  var _daysInTerm : int
  var _rateCache : PolicyPeriodFXRateCache
  var _buildingRatingInfo : CPBuildingRatingInfo

  construct(line : CPLine, building : CPBuilding, executor : CPRateRoutineExecutor, daysInTerm : int, rateCache : PolicyPeriodFXRateCache){
    _line = line
    _executor = executor
    _daysInTerm = daysInTerm
    _rateCache = rateCache
    _buildingRatingInfo = new CPBuildingRatingInfo(building)
  }

  function getRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "CPEquipmentBreakdownEnhance_EXT":
        return CPRateRoutineNames.CP_EQUIPMENT_BREAKDOWN_ENDORSEMENT_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  function rateGroup2(buildingCov : CPBuildingCov, sliceToRate : DateRange) : CostData<Cost, PolicyLine>{
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var costData = new CPBuildingCovGroup2CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    var rateRoutineParameterMap = createBuildingParameterSet(costData)
    _executor.execute(getRateRoutineCode(buildingCov.Pattern), buildingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the parameter set with building rating infos
   */
  private function createBuildingParameterSet(costData : CPCostData<CPCost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_BUILDINGRATINGINFO_EXT -> _buildingRatingInfo,
         TC_COSTDATA           -> costData}
  }
}