package una.rating.ho.tx

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses gw.rating.CostData
uses una.rating.ho.common.HORateRoutineExecutor
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.tx.ratinginfos.HOBasePremiumRatingInfo
uses una.rating.ho.tx.ratinginfos.HORatingInfo

uses java.util.Map
uses una.rating.ho.tx.ratinginfos.HODPBasePremiumRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/11/16
 * Class which rates the base premium for the texas HO policies
 */
class HOBasePremiumRaterTX {
  private var _executor: HORateRoutineExecutor
  private var _rateCache: PolicyPeriodFXRateCache
  private var _dwelling: Dwelling_HOE
  private var _hoRatingInfo: HORatingInfo
  private var _line: HomeownersLine_HOE
  private var _isDPPolicyType : boolean
  private var _baseDPPremiumRatingInfo : HODPBasePremiumRatingInfo
  private var _baseHOPremiumRatingInfo : HOBasePremiumRatingInfo
  private var _rateRoutineParameterMap : Map<CalcRoutineParamName, Object>

  private var _routinesToCostTypeMapping: Map<String, HOCostType_Ext> = {
      HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE -> HOCostType_Ext.TC_BASEPREMIUM,
      HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_RATE_ROUTINE -> HOCostType_Ext.TC_FIREDWELLING,
      HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_PERSONAL_PROPERTY_RATE_ROUTINE -> HOCostType_Ext.TC_FIREPERSONALPROPERTY
  }
  construct(line: HomeownersLine_HOE, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, hoRatingInfo: HORatingInfo) {
    _dwelling = line.Dwelling
    _rateCache = rateCache
    _executor = executor
    _hoRatingInfo = hoRatingInfo
    _line = line
    _isDPPolicyType = typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(line.HOPolicyType)
  }

  /**
   *  Rating engine will call this function to rate the base premium
   */
  function rateBasePremium(dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var routinesToExecute: List<String> = {}
    var costs: List<CostData> = {}
    if(_isDPPolicyType)
      routinesToExecute.addAll(baseDPRoutinesToExecute)
    else
      routinesToExecute.addAll(baseHORoutinesToExecute)
    costs.addAll(executeRoutines(routinesToExecute, dateRange, numDaysInCoverageRatedTerm))
    return costs
  }

  /**
   *  Executes the list of rate routines
   */
  function executeRoutines(routinesToExecute: List<String>, dateRange: DateRange, numDaysInCoverageRatedTerm: int): List<CostData> {
    var costs: List<CostData> = {}
    if (!routinesToExecute.Empty) {
      if(_isDPPolicyType){
        _baseDPPremiumRatingInfo = new HODPBasePremiumRatingInfo(_dwelling)
        _rateRoutineParameterMap = createDPParameterSet()
      } else{
        _baseHOPremiumRatingInfo = new HOBasePremiumRatingInfo(_dwelling)
        _rateRoutineParameterMap = createHOParameterSet()
      }
      for (routine in routinesToExecute) {
        var costData = new HomeownersBaseCostData_HOE(dateRange.start, dateRange.end, _line.Branch.PreferredCoverageCurrency, _rateCache, _routinesToCostTypeMapping.get(routine))
        costData.init(_line)
        costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
        _rateRoutineParameterMap.put(TC_COSTDATA, costData)
        _executor.executeBasedOnSliceDate(routine, _rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
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
  private property get baseHORoutinesToExecute(): List<String> {
    var routines: List<String> = {}
    routines.add(HORateRoutineNames.BASE_PREMIUM_RATE_ROUTINE)
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
  *  returns the list of routines to execute
  */
  private property get baseDPRoutinesToExecute(): List<String> {
     var routinesToExecute: List<String> = {}
    routinesToExecute.add(HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_RATE_ROUTINE)
    if(_dwelling?.DPDW_Personal_Property_HOEExists)
      routinesToExecute.add(HORateRoutineNames.BASE_PREMIUM_DWELLING_FIRE_PERSONAL_PROPERTY_RATE_ROUTINE)
    return routinesToExecute
  }

  /**
   * Created parameter set to execute the base premium routines
   */
  private function createHOParameterSet(): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> _line,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLING_EXT -> _dwelling,
        TC_DWELLINGRATINGINFO_EXT -> _baseHOPremiumRatingInfo,
        TC_State -> _line.BaseState.Code
    }
  }

  /**
   * Created DP parameter set to execute the base premium routines
   */
  function createDPParameterSet(): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> _line,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> _baseDPPremiumRatingInfo
    }
  }
}