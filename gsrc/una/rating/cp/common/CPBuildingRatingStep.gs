package una.rating.cp.common

uses gw.lob.cp.rating.CPBuildingCovGroup2CostData
uses gw.lob.common.util.DateRange
uses gw.financials.PolicyPeriodFXRateCache
uses gw.api.util.JurisdictionMappingUtil
uses gw.api.productmodel.ClausePattern
uses java.util.Map
uses gw.lob.cp.rating.CPCostData
uses gw.rating.CostData
uses gw.lob.cp.rating.CPBuildingCovGroup1CostData
uses una.rating.cp.ratinginfos.CPBuildingRatingInfo
uses gw.lob.cp.rating.CPBuildingCovSpecialCostData
uses una.rating.cp.costdatas.CPBuildingCovOtherThanHurricaneCostData
uses una.rating.cp.costdatas.CPBuildingCovHurricaneCostData

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswam007
 * Date: 2/14/17
 */
class CPBuildingRatingStep {
  var _line: CPLine
  var _executor: CPRateRoutineExecutor
  var _daysInTerm: int
  var _rateCache: PolicyPeriodFXRateCache
  private final var GROUPI_RATE_ROUTINE = "GROUPI_RATE_ROUTINE"
  private final var GROUPII_RATE_ROUTINE = "GROUPII_RATE_ROUTINE"
  private final var SPECIAL_CAUSE_OF_LOSS_RATE_ROUTINE = "SPECIAL_CAUSE_OF_LOSS_RATE_ROUTINE"
  private final var WINDSTORM_NO_HURRICANE_RATE_ROUTINE = "WINDSTORM_NO_HURRICANE_RATE_ROUTINE"
  private final var WINDSTORM_WITH_HURRICANE_RATE_ROUTINE = "WINDSTORM_WITH_HURRICANE_RATE_ROUTINE"
  var _buildingRatingInfo: CPBuildingRatingInfo

  construct(line: CPLine, building: CPBuilding, executor: CPRateRoutineExecutor, daysInTerm: int, rateCache: PolicyPeriodFXRateCache) {
    _line = line
    _executor = executor
    _daysInTerm = daysInTerm
    _rateCache = rateCache
    _buildingRatingInfo = new CPBuildingRatingInfo(building)
  }

  /**
   *   Return all the building coverage rate routines
   */
  function getBuildingCovRoutinesToGroupMapping(coveragePattern: ClausePattern): Map<String, String> {
    switch (coveragePattern) {
      case "CPBldgCov":
        var routines = {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_BUILDING_COVERAGE_GROUPI_RATE_ROUTINE,
                        GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_BUILDING_COVERAGE_GROUPII_RATE_ROUTINE}
        if(_buildingRatingInfo.BuildingCovCauseOfLoss == CPCauseOfLoss.TC_SPECIAL)
          routines.put(SPECIAL_CAUSE_OF_LOSS_RATE_ROUTINE, CPRateRoutineNames.CP_BUILDING_COVERAGE_SPECIAL_RATE_ROUTINE)
        return routines
      case "CPBPPCov":
        var routines =  {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_PERSONAL_PROPERTY_COVERAGE_GROUPI_RATE_ROUTINE,
                         GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_PERSONAL_PROPERTY_COVERAGE_GROUPII_RATE_ROUTINE}
        if(_buildingRatingInfo.PersonalPropertyCovCauseOfLoss == CPCauseOfLoss.TC_SPECIAL)
          routines.put(SPECIAL_CAUSE_OF_LOSS_RATE_ROUTINE, CPRateRoutineNames.CP_PERSONAL_PROPERTY_COVERAGE_SPECIAL_RATE_ROUTINE)
        return routines
      case "CPEquipmentBreakdownEnhance_EXT":
        return {GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_EQUIPMENT_BREAKDOWN_ENDORSEMENT_GROUPII_RATE_ROUTINE}
      case "CPLights_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_LIGHTS_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_LIGHTS_GROUPII_RATE_ROUTINE}
      case "CPPlayGround_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_PLAYGROUND_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_PLAYGROUND_GROUPII_RATE_ROUTINE}
      case "CPMailbox_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_MAILBOX_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_MAILBOX_GROUPII_RATE_ROUTINE}
      case "CPCarport_EXT":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_CARPORT_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_CARPORT_GROUPII_RATE_ROUTINE}
      case "CPEntryGates_EXT":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_ENTRY_GATES_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_ENTRY_GATES_GROUPII_RATE_ROUTINE}
      case "CPFence_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_FENCE_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_FENCE_GROUPII_RATE_ROUTINE}
      case "CPFlagPole_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_FLAGPOLE_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_FLAGPOLE_GROUPII_RATE_ROUTINE}
      case "CPPoolSpaFountainDeck_EXT":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_POOL_SPA_FOUNTAIN_DECK_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_POOL_SPA_FOUNTAIN_DECK_GROUPII_RATE_ROUTINE}
      case "CPSigns_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_GROUPII_RATE_ROUTINE}
      case "CPOther_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_OTHER_NOC_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_OTHER_NOC_GROUPII_RATE_ROUTINE}
      case "CPTrash_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_TRASH_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_TRASH_GROUPII_RATE_ROUTINE}
      case "CPShade_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_SHADE_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_SHADE_GROUPII_RATE_ROUTINE}
      case "CPGazebo_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_GAZEBO_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_GAZEBO_GROUPII_RATE_ROUTINE}
      case "CPFurniture_Ext":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_OUTDOOR_FURNITURE_GROUPI_RATE_ROUTINE,
                GROUPII_RATE_ROUTINE -> CPRateRoutineNames.CP_OUTDOOR_FURNITURE_GROUPII_RATE_ROUTINE}
      case "CPTerrorismCoverage_EXT":
        return {GROUPI_RATE_ROUTINE -> CPRateRoutineNames.CP_TERRORISM_GROUPI_RATE_ROUTINE}
      default:
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  /**
  *  Return the building coverage rate routines for windstorm with no hurricane
   */
  function getBuildingCovRoutinesForWindstormNoHurricane(coveragePattern: ClausePattern): String {
    switch (coveragePattern) {
      case "CPLights_Ext":
          return CPRateRoutineNames.CP_LIGHTS_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPPlayGround_Ext":
          return CPRateRoutineNames.CP_PLAYGROUND_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPMailbox_Ext":
          return CPRateRoutineNames.CP_MAILBOX_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPCarport_EXT":
          return CPRateRoutineNames.CP_CARPORT_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPEntryGates_EXT":
          return CPRateRoutineNames.CP_ENTRY_GATES_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPFence_Ext":
          return CPRateRoutineNames.CP_FENCE_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPFlagPole_Ext":
          return CPRateRoutineNames.CP_FLAGPOLE_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPPoolSpaFountainDeck_EXT":
          return CPRateRoutineNames.CP_POOL_SPA_FOUNTAIN_DECK_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPSigns_Ext":
          return CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPOther_Ext":
          return CPRateRoutineNames.CP_OTHER_NOC_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPTrash_Ext":
          return CPRateRoutineNames.CP_TRASH_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPShade_Ext":
          return CPRateRoutineNames.CP_SHADE_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPGazebo_Ext":
          return CPRateRoutineNames.CP_GAZEBO_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      case "CPFurniture_Ext":
          return CPRateRoutineNames.CP_OUTDOOR_FURNITURE_WINDSTORM_NO_HURRICANE_RATE_ROUTINE
      default:
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  /**
   *  Return the building coverage rate routines for windstorm with hurricane
   */
  function getBuildingCovRoutinesForWindstormWithHurricane(coveragePattern: ClausePattern): String {
    switch (coveragePattern) {
      case "CPBldgCov":
          return CPRateRoutineNames.CP_BUILDING_COVERAGE_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPBPPCov":
          return CPRateRoutineNames.CP_PERSONAL_PROPERTY_COVERAGE_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPLights_Ext":
          return CPRateRoutineNames.CP_LIGHTS_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPPlayGround_Ext":
          return CPRateRoutineNames.CP_PLAYGROUND_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPMailbox_Ext":
          return CPRateRoutineNames.CP_MAILBOX_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPCarport_EXT":
          return CPRateRoutineNames.CP_CARPORT_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPEntryGates_EXT":
          return CPRateRoutineNames.CP_ENTRY_GATES_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPFence_Ext":
          return CPRateRoutineNames.CP_FENCE_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPFlagPole_Ext":
          return CPRateRoutineNames.CP_FLAGPOLE_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPPoolSpaFountainDeck_EXT":
          return CPRateRoutineNames.CP_POOL_SPA_FOUNTAIN_DECK_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPSigns_Ext":
          return CPRateRoutineNames.CP_SIGNS_DETACHED_OUTDOOR_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPOther_Ext":
          return CPRateRoutineNames.CP_OTHER_NOC_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPTrash_Ext":
          return CPRateRoutineNames.CP_TRASH_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPShade_Ext":
          return CPRateRoutineNames.CP_SHADE_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPGazebo_Ext":
          return CPRateRoutineNames.CP_GAZEBO_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
      case "CPFurniture_Ext":
          return CPRateRoutineNames.CP_OUTDOOR_FURNITURE_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE
        default:
        throw "Rating is not supported for ${coveragePattern.ClauseName}"
    }
  }

  /**
  *  Rate routines for the ordinance or law coverage
   */
  function getRoutinesForOrdinanceOrLawCov(buildingCov : CPOrdinanceorLaw_EXT, windstormApplicable : boolean, hurricaneIncluded : boolean): Map<String, List<String>> {
    var rateRoutinesWithGroup : Map<String, List<String>> = {}
    var rateRoutinesGroup1 : List<String> = {}
    var rateRoutinesGroup2 : List<String> = {}
    var rateRoutinesWindStormNoHurricane : List<String> = {}
    var rateRoutinesWindStormWithHurricane: List<String> = {}
    if(buildingCov?.CPOrdinanceorLawCoverage_EXTTerm?.Value == CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT){
      rateRoutinesGroup1.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_GROUPI_RATE_ROUTINE)
      rateRoutinesGroup2.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_GROUPII_RATE_ROUTINE)
      if(windstormApplicable){
        if(hurricaneIncluded)
          rateRoutinesWindStormWithHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE)
        else
          rateRoutinesWindStormNoHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_WINDSTORM_NO_HURRICANE_RATE_ROUTINE)
      }
    }
    if(buildingCov?.CPOrdinanceorLawCoverage_EXTTerm?.Value == CPOutdoorPropCovType_EXT.TC_COVABANDC_EXT ||
       buildingCov?.CPOrdinanceorLawCoverage_EXTTerm?.Value == CPOutdoorPropCovType_EXT.TC_COVCONLY_EXT ||
       buildingCov?.CPOrdinanceorLawCoverage_EXTTerm?.Value == CPOutdoorPropCovType_EXT.TC_COVAANDC_EXT){
      rateRoutinesGroup1.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_GROUPI_RATE_ROUTINE)
      rateRoutinesGroup2.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_GROUPII_RATE_ROUTINE)
      if(windstormApplicable){
        if(hurricaneIncluded)
          rateRoutinesWindStormWithHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE)
        else
          rateRoutinesWindStormNoHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_WINDSTORM_NO_HURRICANE_RATE_ROUTINE)
      }
    }
    if(buildingCov?.CPOrdinanceorLawCoverage_EXTTerm?.Value == CPOutdoorPropCovType_EXT.TC_COVACOMBINEDBC_EXT){
      rateRoutinesGroup1.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_GROUPI_RATE_ROUTINE)
      rateRoutinesGroup2.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_GROUPII_RATE_ROUTINE)
      if(windstormApplicable){
        if(hurricaneIncluded)
          rateRoutinesWindStormWithHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE)
        else
          rateRoutinesWindStormNoHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_WINDSTORM_NO_HURRICANE_RATE_ROUTINE)
      }
    }
    if(buildingCov?.CPOrdinanceorLawCoverage_EXTTerm?.Value == CPOutdoorPropCovType_EXT.TC_COVAANDBCCOMBINED_EXT){
      rateRoutinesGroup1.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_GROUPI_RATE_ROUTINE)
      rateRoutinesGroup2.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_GROUPII_RATE_ROUTINE)
      if(windstormApplicable){
        if(hurricaneIncluded)
          rateRoutinesWindStormWithHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE)
        else
          rateRoutinesWindStormNoHurricane.add(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_WINDSTORM_NO_HURRICANE_RATE_ROUTINE)
      }
    }
    rateRoutinesWithGroup.put(GROUPI_RATE_ROUTINE, rateRoutinesGroup1)
    rateRoutinesWithGroup.put(GROUPII_RATE_ROUTINE, rateRoutinesGroup2)
    rateRoutinesWithGroup.put(WINDSTORM_WITH_HURRICANE_RATE_ROUTINE, rateRoutinesWindStormWithHurricane)
    rateRoutinesWithGroup.put(WINDSTORM_NO_HURRICANE_RATE_ROUTINE, rateRoutinesWindStormNoHurricane)
    return rateRoutinesWithGroup
  }

  /**
   *  Function to map the rate routine to the cost type
   */
  property get RoutinesToCostTypeMapping(): Map<String, CPCostType_Ext> {
    var rateRoutines : Map<String, CPCostType_Ext> = {}
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_GROUPI_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEB)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_GROUPI_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEC)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_GROUPI_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEBCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_GROUPI_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEABCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_GROUPII_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEB)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_GROUPII_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEC)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_GROUPII_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEBCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_GROUPII_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEABCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEB)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEC)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEBCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_WINDSTORM_WITH_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEABCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_B_WINDSTORM_NO_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEB)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_C_WINDSTORM_NO_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEC)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_BC_COMBINED_WINDSTORM_NO_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEBCCOMBINED)
    rateRoutines.put(CPRateRoutineNames.CP_ORDINANCE_OR_LAW_COVERAGE_ABC_COMBINED_WINDSTORM_NO_HURRICANE_RATE_ROUTINE, CPCostType_Ext.TC_COVERAGEABCCOMBINED)
    return rateRoutines
  }

  /**
   * function to rate the CP building coverages with group rates
  */
  function rateBuildingCoverageWithGroupRates(buildingCov: CPBuildingCov, sliceToRate: DateRange): List<CostData<Cost, PolicyLine>> {
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var costData : CPCostData = null
    var costDataList : List<CostData<Cost, PolicyLine>> = {}
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    var routinesToExecute = getBuildingCovRoutinesToGroupMapping(buildingCov.Pattern)
    for(rateRoutineKey in routinesToExecute.Keys){
      if(rateRoutineKey == GROUPI_RATE_ROUTINE){
        costData = new CPBuildingCovGroup1CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
      } else if(rateRoutineKey == GROUPII_RATE_ROUTINE){
        costData = new CPBuildingCovGroup2CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
      } else if(rateRoutineKey == SPECIAL_CAUSE_OF_LOSS_RATE_ROUTINE){
        costData = new CPBuildingCovSpecialCostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
      }
      rateRoutineParameterMap = createBuildingParameterSet(costData)
      costData.init(_line)
      costData.NumDaysInRatedTerm = _daysInTerm
      _executor.execute(routinesToExecute.get(rateRoutineKey), buildingCov, rateRoutineParameterMap, costData)
      if(costData != null){
        costData.copyStandardColumnsToActualColumns()
        costDataList.add(costData)
      }
    }
    return costDataList
  }

  /**
  *Function to rate the ordinance or law rate routine coverages
   */
  function rateOrdinanceOrLawCoverage(buildingCov: CPOrdinanceorLaw_EXT, sliceToRate: DateRange, windstormApplicable : boolean, hurricaneIncluded : boolean): List<CostData<Cost, PolicyLine>> {
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var costData : CPCostData = null
    var costDataList : List<CostData<Cost, PolicyLine>> = {}
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    var rateRoutinesToExecute = getRoutinesForOrdinanceOrLawCov(buildingCov, windstormApplicable, hurricaneIncluded)
    for(rateRoutineKey in rateRoutinesToExecute.Keys){
      var rateRoutineList = rateRoutinesToExecute.get(rateRoutineKey)
      for(rateRoutine in rateRoutineList){
        if(rateRoutineKey == GROUPI_RATE_ROUTINE){
          costData = new CPBuildingCovGroup1CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state, RoutinesToCostTypeMapping.get(rateRoutine))
        } else if(rateRoutineKey == GROUPII_RATE_ROUTINE){
          costData = new CPBuildingCovGroup2CostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state, RoutinesToCostTypeMapping.get(rateRoutine))
        } else if(rateRoutineKey == WINDSTORM_WITH_HURRICANE_RATE_ROUTINE){
          costData = new CPBuildingCovHurricaneCostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state, RoutinesToCostTypeMapping.get(rateRoutine))
        } else if(rateRoutineKey == WINDSTORM_NO_HURRICANE_RATE_ROUTINE){
          costData = new CPBuildingCovOtherThanHurricaneCostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state, RoutinesToCostTypeMapping.get(rateRoutine))
        }
        rateRoutineParameterMap = createBuildingParameterSet(costData)
        costData.init(_line)
        costData.NumDaysInRatedTerm = _daysInTerm
        _executor.execute(rateRoutine, buildingCov, rateRoutineParameterMap, costData)
        if(costData != null){
          costData.copyStandardColumnsToActualColumns()
          costDataList.add(costData)
        }
      }
    }
    return costDataList
  }

  /**
   * function to rate the CP building coverages with no hurricane
   */
  function rateBuildingCoverageWithNoHurricane(buildingCov: CPBuildingCov, sliceToRate: DateRange): CostData<Cost, PolicyLine> {
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    var routinesToExecute = getBuildingCovRoutinesForWindstormNoHurricane(buildingCov.Pattern)
    var costData = new CPBuildingCovOtherThanHurricaneCostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
    rateRoutineParameterMap = createBuildingParameterSet(costData)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    _executor.execute(routinesToExecute, buildingCov, rateRoutineParameterMap, costData)
    costData?.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * function to rate the CP building coverages with hurricane
   */
  function rateBuildingCoverageWithHurricane(buildingCov: CPBuildingCov, sliceToRate: DateRange): CostData<Cost, PolicyLine> {
    var state = JurisdictionMappingUtil.getJurisdiction(buildingCov.CPBuilding.CPLocation.Location)
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    var routinesToExecute = getBuildingCovRoutinesForWindstormWithHurricane(buildingCov.Pattern)
    var costData = new CPBuildingCovHurricaneCostData(sliceToRate.start, sliceToRate.end, buildingCov.Currency, _rateCache, buildingCov.FixedId, state)
    rateRoutineParameterMap = createBuildingParameterSet(costData)
    costData.init(_line)
    costData.NumDaysInRatedTerm = _daysInTerm
    _executor.execute(routinesToExecute, buildingCov, rateRoutineParameterMap, costData)
    costData?.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the parameter set with building rating infos
   */
  private function createBuildingParameterSet(costData: CPCostData<CPCost>): Map<CalcRoutineParamName, Object> {
    return {TC_POLICYLINE         -> _line,
            TC_BUILDINGRATINGINFO_EXT -> _buildingRatingInfo,
            TC_COSTDATA           -> costData}
  }
}