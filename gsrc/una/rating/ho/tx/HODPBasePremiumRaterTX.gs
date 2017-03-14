package una.rating.ho.tx

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses gw.rating.CostData
uses una.rating.ho.common.HORateRoutineExecutor
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.tx.ratinginfos.HORatingInfo
uses java.util.Map
uses una.rating.ho.tx.ratinginfos.HODPBasePremiumRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/11/16
 * Class which rates the base premium for the texas HO policies
 */
class HODPBasePremiumRaterTX {
  private var _executor: HORateRoutineExecutor
  private var _rateCache: PolicyPeriodFXRateCache
  private var _dwelling: Dwelling_HOE
  private var _hoRatingInfo: HORatingInfo
  private var _line: HomeownersLine_HOE
  private var _basePremiumRatingInfo : HODPBasePremiumRatingInfo

  private var _routinesToCostTypeMapping: Map<String, HOCostType_Ext> = {
      HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_RATE_ROUTINE -> HOCostType_Ext.TC_FIREDWELLING,
      HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_PERSONAL_PROPERTY_RATE_ROUTINE -> HOCostType_Ext.TC_FIREPERSONALPROPERTY
  }
  construct(line: HomeownersLine_HOE, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, hoRatingInfo: HORatingInfo, basePremiumRatingInfo : HODPBasePremiumRatingInfo) {
    _dwelling = line.Dwelling
    _rateCache = rateCache
    _executor = executor
    _hoRatingInfo = hoRatingInfo
    _line = line
    _basePremiumRatingInfo = basePremiumRatingInfo
  }

  /**
   *  Rating engine will call this function to rate the base premium
   */
  function rateBasePremium(dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var routinesToExecute: List<String> = {}
    var costs: List<CostData> = {}
    routinesToExecute.add(HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_RATE_ROUTINE)
    routinesToExecute.add(HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_PERSONAL_PROPERTY_RATE_ROUTINE)
    //routinesToExecute.addAll(baseRoutinesToExecute)
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
        var costData = new HomeownersBaseCostData_HOE(dateRange.start, dateRange.end, _line.Branch.PreferredCoverageCurrency, _rateCache, _routinesToCostTypeMapping.get(routine))
        costData.init(_line)
        costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
        var rateRoutineParameterMap = createParameterSet()
        rateRoutineParameterMap.put(TC_COSTDATA, costData)
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
    if (_dwelling.HODW_Dwelling_Cov_HOEExists){
      if (_dwelling.HODW_Dwelling_Cov_HOE?.HODW_DwellingValuation_HOE_ExtTerm.Value == ValuationMethod.TC_REPLCOST) {
        routines.add(HORateRoutineNames.HO_REPLACEMENT_COST_DWELLING_RATE_ROUTINE)
        _routinesToCostTypeMapping.put(HORateRoutineNames.HO_REPLACEMENT_COST_DWELLING_RATE_ROUTINE, HOCostType_EXT.TC_REPLACEMENTCOSTONDWELLING)
      } else {
        routines.add(HORateRoutineNames.HO_REPLACEMENT_COST_DWELLING_RATE_ROUTINE)
        _routinesToCostTypeMapping.put(HORateRoutineNames.HO_REPLACEMENT_COST_DWELLING_RATE_ROUTINE, HOCostType_EXT.TC_REPLACEMENTCOSTCOVERAGEWITHROOFSURFACING)
      }
      if (_dwelling.HODW_AdditionalPerilCov_HOE_ExtExists){
        routines.add(HORateRoutineNames.HOA_PLUS_COVERAGE_RATE_ROUTINE)
        _routinesToCostTypeMapping.put(HORateRoutineNames.HOA_PLUS_COVERAGE_RATE_ROUTINE, HOCostType_Ext.TC_HOAPLUSCOVERAGE)
      }
    }
    if (_dwelling.HODW_Personal_Property_HOEExists){
      if (_dwelling.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost){
        routines.add(HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE)
        _routinesToCostTypeMapping.put(HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_REPLACEMENTCOSTONPERSONALPROPERTY)
      }
    }
    return routines
  }

  /**
   * Created parameter set to execute the base premium routines
   */
  function createParameterSet(): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> _line,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> _basePremiumRatingInfo
    }
  }
}