package una.rating.ho.group3

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses gw.rating.CostData
uses gw.rating.worksheet.domain.WorksheetEntry
uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses una.rating.ho.common.HORateRoutineExecutor
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.group3.ratinginfos.HORatingInfo

uses java.util.Map
uses una.rating.ho.group3.ratinginfos.HOBasePremiumRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/11/16
 * Class which rates the base premium for the Group 3 HO policies
 */
class HOBasePremiumRaterGroup3 {
  private var _executor: HORateRoutineExecutor
  private var _rateCache: PolicyPeriodFXRateCache
  private var _dwelling: Dwelling_HOE
  private var _hoRatingInfo: HORatingInfo
  private var _line: HomeownersLine_HOE
  private final var AOP_KEY_FACTOR_RATE_ROUTINE = "UNAHOAOPKeyFactorRateRoutine"
  private final var WIND_KEY_FACTOR_RATE_ROUTINE = "UNAHOWindKeyFactorRateRoutine"
  private final var PROTECTION_CONSTRUCTION_FACTOR_RATE_ROUTINE = "UNAHOProtectionConstructionFactorRateRoutine"
  private var _routinesToCostTypeMapping: Map<String, HOCostType_Ext> = {
      HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE -> HOCostType_Ext.TC_AOPBASEPREMIUM,
      AOP_KEY_FACTOR_RATE_ROUTINE -> HOCostType_Ext.TC_KEYFACTORBASEPREMIUM,
      WIND_KEY_FACTOR_RATE_ROUTINE -> HOCostType_Ext.TC_KEYFACTORBASEPREMIUM,
      PROTECTION_CONSTRUCTION_FACTOR_RATE_ROUTINE -> HOCostType_Ext.TC_PROTECTIONCONSTRUCTIONFACTORBASEPREMIUM,
      HORateRoutineNames.WIND_BASE_PREMIUM_RATE_ROUTINE -> HOCostType_Ext.TC_WINDBASEPREMIUM,
      HORateRoutineNames.DP_DWELLING_BASE_PREMIUM -> HOCostType_Ext.TC_FIREDWELLING,
      HORateRoutineNames.DP_PERSONAL_PROPERTY_BASE_PREMIUM  -> HOCostType_Ext.TC_FIREPERSONALPROPERTY,
      HORateRoutineNames.DP_EC_DWELLING_BASE_PREMIUM -> HOCostType_Ext.TC_FIREECDWELLING,
      HORateRoutineNames.DP_EC_PERSONAL_PROPERTY_BASE_PREMIUM -> HOCostType_Ext.TC_FIREECPERSONALPROPERTY

  }
  //todo fix once ec is available
  private var EC = true
  construct(dwelling: Dwelling_HOE, line: HomeownersLine_HOE, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, hoRatingInfo: HORatingInfo) {
    _dwelling = dwelling
    _rateCache = rateCache
    _executor = executor
    _hoRatingInfo = hoRatingInfo
    _line = line
  }

  /**
   *  Rating engine will call this function to rate the base premium
   */
  function rateBasePremium(dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var routinesToExecute: List<String> = {}
    var costs: List<CostData> = {}
    var costDatas = executeRoutines(nonCostRoutinesToExecute, dateRange, numDaysInCoverageRatedTerm)
    var wsc: List<WorksheetEntry> = {}
    for (costData in costDatas)
      if (costData.WorksheetEntries.Count > 0)
        wsc.add(costData.WorksheetEntries.first())
    routinesToExecute.addAll(baseRoutinesToExecute)
    costs.addAll(executeRoutines(routinesToExecute, dateRange, numDaysInCoverageRatedTerm))
    costs.each(\cost -> cost.addWorksheetEntries(wsc))
    return costs
  }

  /**
   *  Executes the list of rate routines
   */
  function executeRoutines(routinesToExecute: List<String>, dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var costs: List<CostData> = {}
    if (!routinesToExecute.Empty) {
      for (routine in routinesToExecute) {
        var basePremiumRatingInfo = new HOBasePremiumRatingInfo(_dwelling)
        var costData = new HomeownersBaseCostData_HOE(dateRange.start, dateRange.end, _line.Branch.PreferredCoverageCurrency, _rateCache, _routinesToCostTypeMapping.get(routine))
        costData.init(_line)
        costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
        var rateRoutineParameterMap = createParameterSet(costData, basePremiumRatingInfo)
        _executor.executeBasedOnSliceDate(routine, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
        if (costData != null){
          costs.add(costData)
        }
      }
    }
    return costs
  }

  private property get nonCostRoutinesToExecute(): List<String>{
    var routines : List<String> = {}

    if(_line.HOPolicyType != TC_DP3_Ext){
      routines ={AOP_KEY_FACTOR_RATE_ROUTINE, WIND_KEY_FACTOR_RATE_ROUTINE, PROTECTION_CONSTRUCTION_FACTOR_RATE_ROUTINE}
    }

    return routines
  }


  /**
   *  returns the list of routines to execute
   */
  private property get baseRoutinesToExecute(): List<String> {
    var routines: List<String> = {}

    if(_line.HOPolicyType == TC_DP3_Ext){
      routines.add(HORateRoutineNames.DP_DWELLING_BASE_PREMIUM)
      if(_dwelling.DPDW_Personal_Property_HOEExists){
        routines.add(HORateRoutineNames.DP_PERSONAL_PROPERTY_BASE_PREMIUM)
      }
      if(EC){
        routines.add(HORateRoutineNames.DP_EC_DWELLING_BASE_PREMIUM)
        if(_dwelling.DPDW_Personal_Property_HOEExists){
          routines.add(HORateRoutineNames.DP_EC_PERSONAL_PROPERTY_BASE_PREMIUM)
        }
      }
    }else{
      routines.add(HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE)
      if (!_dwelling.HOLine.HODW_WindstromHailExc_HOE_ExtExists){
        routines.add(HORateRoutineNames.WIND_BASE_PREMIUM_RATE_ROUTINE)
      }
    }
    return routines
  }

  /**
   * Created parameter set to execute the base premium routines
   */
  private function createParameterSet(costData: CostData, basePremiumRatingInfo: HOBasePremiumRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> _line,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> basePremiumRatingInfo,
        TC_State -> _line.BaseState,
        TC_COSTDATA -> costData
    }
  }
}