package una.rating.ho.nc

uses una.rating.ho.common.HORateRoutineExecutor
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.nc.ratinginfos.HORatingInfo
uses java.util.Map
uses una.rating.ho.common.HORateRoutineNames
uses gw.lob.common.util.DateRange
uses gw.rating.CostData
uses una.rating.ho.nc.ratinginfos.HOBasePremiumRatingInfo
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses gw.rating.worksheet.domain.WorksheetEntry

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
class HOBasePremiumRaterNC {
  private var _executor: HORateRoutineExecutor
  private var _rateCache: PolicyPeriodFXRateCache
  private var _dwelling: Dwelling_HOE
  private var _hoRatingInfo: HORatingInfo
  private var _line: HomeownersLine_HOE
  private var _routinesToCostTypeMapping: Map<String, HOCostType_Ext> = {
      HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM,
      HORateRoutineNames.NCRB_PREMIUM_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM
  }
  private var _basePremiumRatingInfo : HOBasePremiumRatingInfo

  construct(dwelling: Dwelling_HOE, line: HomeownersLine_HOE, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, hoRatingInfo: HORatingInfo) {
    _dwelling = dwelling
    _rateCache = rateCache
    _executor = executor
    _hoRatingInfo = hoRatingInfo
    _line = line
    _basePremiumRatingInfo = new HOBasePremiumRatingInfo(_dwelling)
  }

  /**
   *  Rating engine will call this function to rate the base premium
   */
  function rateBasePremium(dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var routinesToExecute: List<String> = {}
    var costs: List<CostData> = {}
    var nonCostRoutinesToExecute: List<String> = {HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE}
    var costDatas = executeRoutines(nonCostRoutinesToExecute, dateRange, numDaysInCoverageRatedTerm)
    var wsc: List<WorksheetEntry> = {}
    for (costData in costDatas)
      if (costData.WorksheetEntries.Count > 0)
        wsc.add(costData.WorksheetEntries.first())
    routinesToExecute.addAll(baseRoutinesToExecute)
    costs.addAll(executeRoutines(routinesToExecute, dateRange, numDaysInCoverageRatedTerm))
    if(_basePremiumRatingInfo.ConsentToRate){
      _dwelling.Branch.ConsentToRate_Ext = true
      createHistoryEventTransaction(_dwelling.PolicyPeriod)
    }
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
        var costData = new HomeownersBaseCostData_HOE(dateRange.start, dateRange.end, _line.Branch.PreferredCoverageCurrency, _rateCache, _routinesToCostTypeMapping.get(routine))
        costData.init(_line)
        costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
        var rateRoutineParameterMap = createParameterSet(costData, _basePremiumRatingInfo)
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
    routines.add(HORateRoutineNames.NCRB_PREMIUM_RATE_ROUTINE)
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
        TC_COSTDATA -> costData
    }
  }

  // Method that created History event for Consent To Rate Identified in Policy transaction
  public  function createHistoryEventTransaction (policyPeriod : entity.PolicyPeriod){
    if(policyPeriod != null)    {
      var msg = displaykey.Web.CTR.History.Event.Msg+ " For Policy Period :  " + policyPeriod.Policy.DisplayName
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        var Job = bundle.add(policyPeriod.Job)
        Job.createCustomHistoryEvent(CustomHistoryType.TC_CTRIDENDIFIED, \ -> msg)
      })
    }
  }
}

