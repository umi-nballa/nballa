package una.rating.ho.group1

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses java.util.Map
uses gw.rating.CostData
uses una.rating.ho.group1.ratinginfos.HOBasePremiumRatingInfo
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses una.rating.ho.HORateRoutineExecutor
uses una.rating.ho.group1.ratinginfos.HORatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/11/16
 * Class which rates the base premium for the texas HO policies
 */
class HOBasePremiumRater {

  private static var BASE_PREMIUM_AZ_RATE_ROUTINE = "UNAHOBasePremiumAZRateRoutine"
  private static var BASE_PREMIUM_CA_RATE_ROUTINE = "UNAHOBasePremiumCARateRoutine"
  private static var BASE_PREMIUM_NV_RATE_ROUTINE = "UNAHOBasePremiumNVRateRoutine"

  private var _executor: HORateRoutineExecutor
  private var _rateCache: PolicyPeriodFXRateCache
  private var _dwelling: Dwelling_HOE
  private var _hoRatingInfo: HORatingInfo
  private var _line: HomeownersLine_HOE

  private var _routinesToCostTypeMapping: Map<String, HOCostType_Ext> = {
      BASE_PREMIUM_AZ_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM,
      BASE_PREMIUM_CA_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM,
      BASE_PREMIUM_NV_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM
  }
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
    routinesToExecute.addAll(baseRoutinesToExecute)
    costs.addAll(executeRoutines(routinesToExecute, dateRange, numDaysInCoverageRatedTerm))
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

  /**
   *  returns the list of routines to execute
   */
  private property get baseRoutinesToExecute(): List<String> {
    var routines: List<String> = {}
    if(_line.BaseState.Code == "AZ")
      routines.add(BASE_PREMIUM_AZ_RATE_ROUTINE)
    else if(_line.BaseState.Code == "CA")
      routines.add(BASE_PREMIUM_CA_RATE_ROUTINE)
    else if(_line.BaseState.Code == "NV")
      routines.add(BASE_PREMIUM_NV_RATE_ROUTINE)
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
        TC_State -> _line.BaseState.Code,
        TC_COSTDATA -> costData
    }
  }
}