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
uses una.rating.cp.ratinginfos.CPGroupIIBuildingRatingInfo
uses gw.lob.cp.rating.CPBuildingCovGroup1CostData
uses una.rating.cp.ratinginfos.CPGroupIBuildingRatingInfo

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
  var _groupIIBuildingRatingInfo : CPGroupIIBuildingRatingInfo
  var _groupIBuildingRatingInfo : CPGroupIBuildingRatingInfo

  construct(line : CPLine, building : CPBuilding, executor : CPRateRoutineExecutor, daysInTerm : int, rateCache : PolicyPeriodFXRateCache){
    _line = line
    _executor = executor
    _daysInTerm = daysInTerm
    _rateCache = rateCache
    _groupIIBuildingRatingInfo = new CPGroupIIBuildingRatingInfo(building)
    _groupIBuildingRatingInfo = new CPGroupIBuildingRatingInfo(building)
  }

  function getGroupIIRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "CPEquipmentBreakdownEnhance_EXT":
        return CPRateRoutineNames.CP_EQUIPMENT_BREAKDOWN_ENDORSEMENT_GROUPII_RATE_ROUTINE
      case "CPLights_Ext" :
        return CPRateRoutineNames.CP_LIGHTS_GROUPII_RATE_ROUTINE
      case "CPPlayGround_Ext" :
        return CPRateRoutineNames.CP_PLAYGROUND_GROUPII_RATE_ROUTINE
      case "CPMailbox_Ext" :
        return CPRateRoutineNames.CP_MAILBOX_GROUPII_RATE_ROUTINE
      case "CPCarport_EXT" :
        return CPRateRoutineNames.CP_CARPORT_GROUPII_RATE_ROUTINE
      case "CPEntryGates_EXT" :
        return CPRateRoutineNames.CP_ENTRY_GATES_GROUPII_RATE_ROUTINE
      case "CPFence_Ext" :
        return CPRateRoutineNames.CP_FENCE_GROUPII_RATE_ROUTINE
      case "CPFlagPole_Ext" :
        return CPRateRoutineNames.CP_FLAGPOLE_GROUPII_RATE_ROUTINE
      case "CPPoolSpaFountainDeck_EXT" :
        return CPRateRoutineNames.CP_POOL_SPA_FOUNTAIN_DECK_GROUPII_RATE_ROUTINE
      case "CPSigns_Ext" :
        return CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_GROUPII_RATE_ROUTINE
      case "CPOther_Ext" :
        return CPRateRoutineNames.CP_OTHER_NOC_GROUPII_RATE_ROUTINE
      case "CPTrash_Ext" :
        return CPRateRoutineNames.CP_TRASH_GROUPII_RATE_ROUTINE
      case "CPShade_Ext" :
        return CPRateRoutineNames.CP_SHADE_GROUPII_RATE_ROUTINE
      case "CPGazebo_Ext" :
        return CPRateRoutineNames.CP_GAZEBO_GROUPII_RATE_ROUTINE
      case "CPFurniture_Ext" :
        return CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_GROUPII_RATE_ROUTINE
      default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  function getGroupIRateRoutineCode(coveragePattern : ClausePattern) : String {
    switch (coveragePattern) {
      case "CPLights_Ext" :
          return CPRateRoutineNames.CP_LIGHTS_GROUPI_RATE_ROUTINE
      case "CPPlayGround_Ext" :
          return CPRateRoutineNames.CP_PLAYGROUND_GROUPI_RATE_ROUTINE
      case "CPMailbox_Ext" :
          return CPRateRoutineNames.CP_MAILBOX_GROUPI_RATE_ROUTINE
      case "CPCarport_EXT" :
          return CPRateRoutineNames.CP_CARPORT_GROUPI_RATE_ROUTINE
      case "CPEntryGates_EXT" :
          return CPRateRoutineNames.CP_ENTRY_GATES_GROUPI_RATE_ROUTINE
      case "CPFence_Ext" :
          return CPRateRoutineNames.CP_FENCE_GROUPI_RATE_ROUTINE
      case "CPFlagPole_Ext" :
          return CPRateRoutineNames.CP_FLAGPOLE_GROUPI_RATE_ROUTINE
      case "CPPoolSpaFountainDeck_EXT" :
          return CPRateRoutineNames.CP_POOL_SPA_FOUNTAIN_DECK_GROUPI_RATE_ROUTINE
      case "CPSigns_Ext" :
          return CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_GROUPI_RATE_ROUTINE
      case "CPOther_Ext" :
          return CPRateRoutineNames.CP_OTHER_NOC_GROUPI_RATE_ROUTINE
      case "CPTrash_Ext" :
          return CPRateRoutineNames.CP_TRASH_GROUPI_RATE_ROUTINE
      case "CPShade_Ext" :
          return CPRateRoutineNames.CP_SHADE_GROUPI_RATE_ROUTINE
      case "CPGazebo_Ext" :
          return CPRateRoutineNames.CP_GAZEBO_GROUPI_RATE_ROUTINE
      case "CPFurniture_Ext" :
          return CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_GROUPI_RATE_ROUTINE
        default :
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  function rateGroup2(buildingCov : CPBuildingCov, sliceToRate : DateRange) : CostData<Cost, PolicyLine>{
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var costData = new CPBuildingCovGroup2CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    var rateRoutineParameterMap = createGroupIIBuildingParameterSet(costData)
    _executor.execute(getGroupIIRateRoutineCode(buildingCov.Pattern), buildingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  function rateGroup1(buildingCov : CPBuildingCov, sliceToRate : DateRange) : CostData<Cost, PolicyLine>{
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var costData = new CPBuildingCovGroup1CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    var rateRoutineParameterMap = createGroupIBuildingParameterSet(costData)
    _executor.execute(getGroupIRateRoutineCode(buildingCov.Pattern), buildingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the Group II parameter set with building rating infos
   */
  private function createGroupIIBuildingParameterSet(costData : CPCostData<CPCost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_BUILDINGRATINGINFO_EXT -> _groupIIBuildingRatingInfo,
         TC_COSTDATA           -> costData}
  }

  /**
   * creates the Group I parameter set with building rating infos
   */
  private function createGroupIBuildingParameterSet(costData : CPCostData<CPCost>) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> _line,
         TC_BUILDINGRATINGINFO_EXT -> _groupIBuildingRatingInfo,
         TC_COSTDATA           -> costData}
  }
}