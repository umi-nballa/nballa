package una.rating.ho.group1

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses gw.rating.CostData
uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses una.rating.ho.common.HORateRoutineExecutor
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.group1.ratinginfos.HORatingInfo

uses java.util.Map

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/11/16
 * Class which rates the base premium for the Group 1 HO policies
 */
class HOBasePremiumRaterGroup1 {
  private var _executor: HORateRoutineExecutor
  private var _rateCache: PolicyPeriodFXRateCache
  private var _dwelling: Dwelling_HOE
  private var _hoRatingInfo: HORatingInfo
  private var _line: HomeownersLine_HOE
  private var _routinesToCostTypeMapping: Map<String, HOCostType_Ext> = {
      HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM
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
    var costs: List<CostData> = {}
    var routinesToExecute = rateRoutinesToExecute()
    costs.addAll(executeRoutines(routinesToExecute, dateRange, numDaysInCoverageRatedTerm))
    return costs
  }

  function rateRoutinesToExecute() : List<String>{
    var routinesToExecute: List<String> = {}

    if(_line.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT){

    } else{
      routinesToExecute.add(HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE)
    }


    return routinesToExecute

  }

  /**
   *  Executes the list of rate routines
   */
  function executeRoutines(routinesToExecute: List<String>, dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var costs: List<CostData> = {}
    if (!routinesToExecute.Empty) {
      for (routine in routinesToExecute) {
        var basePremiumRatingInfo = new HOCommonBasePremiumRatingInfo(_dwelling)
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
   * Created parameter set to execute the base premium routines
   */
  private function createParameterSet(costData: CostData, basePremiumRatingInfo: HOCommonBasePremiumRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> _line,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> basePremiumRatingInfo,
        TC_State -> _line.BaseState.Code,
        TC_COSTDATA -> costData
    }
  }
}