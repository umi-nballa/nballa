package una.rating.util

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.ScheduleCovCostData_HOE
uses gw.lob.ho.rating.ScheduleLineCovCostData_HOE_Ext
uses gw.rating.CostData
uses una.rating.ho.common.HORateRoutineExecutor
uses una.rating.ho.common.HomeownersLineCostData_HOE

uses java.util.Map
uses gw.lob.ho.rating.HOTaxCostData_HOE

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/4/16
 * Time: 11:28 AM
 */
class HOCreateCostDataUtil {
  /**
   * creates cost data for the dwelling level coverages
   */
  public static function createCostDataForDwellingCoverage(dwellingCov: DwellingCov_HOE, dateRange: DateRange, routineName: String, rateCache: PolicyPeriodFXRateCache,
                                                           line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>, executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int): CostData {
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, rateCache, dwellingCov.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates cost data for the scheduled dwelling coverages
   */
  public static function createCostDataForScheduledDwellingCoverage(dwellingCov: DwellingCov_HOE, dateRange: DateRange, routineName: String, item: ScheduledItem_HOE, rateCache: PolicyPeriodFXRateCache,
                                                                    line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>, executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int): CostData {
    var costData = new ScheduleCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, rateCache, dwellingCov.FixedId, item.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates cost data for the scheduled line coverages
   */
  public static function createCostDataForScheduledLineCoverage(lineCov: HomeownersLineCov_HOE, dateRange: DateRange, routineName: String, item: HOscheduleItem_HOE_Ext, rateCache: PolicyPeriodFXRateCache,
                                                                line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>, executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int): CostData {
    var costData = new ScheduleLineCovCostData_HOE_Ext(dateRange.start, dateRange.end, lineCov.Currency, rateCache, lineCov.FixedId, item.FixedId, null)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.execute(routineName, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates cost data for the Additional scheduled location line coverages
   */
  public static function createCostDataForAdditionalScheduledLineCoverage(lineCov: HomeownersLineCov_HOE, dateRange: DateRange, routineName: String, item: CoveredLocation_HOE, rateCache: PolicyPeriodFXRateCache,
                                                                line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>, executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int): CostData {
    var costData = new ScheduleLineCovCostData_HOE_Ext(dateRange.start, dateRange.end, lineCov.Currency, rateCache, lineCov.FixedId, null, item.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.execute(routineName, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the cost data for the Line level coverages
   */
  public static function createCostDataForLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange, routineName: String, rateCache: PolicyPeriodFXRateCache,
                                                        line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>,
                                                        executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int): CostData {
    var costData = new HomeownersCovCostData_HOE(dateRange.start, dateRange.end, lineCov.Currency, rateCache, lineCov.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.execute(routineName, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the cost data for the line level costs
   */
  public static function createCostDataForHOLineCosts(dateRange: DateRange, routineName: String, costType: HOCostType_Ext, rateCache: PolicyPeriodFXRateCache,
                                                      line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>, executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int): CostData {
    var costData = new HomeownersLineCostData_HOE(dateRange.start, dateRange.end, (line as HomeownersLine_HOE).PreferredCoverageCurrency, rateCache, costType)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.executeBasedOnSliceDate(routineName, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  public static function createCostDataForTaxCosts(dateRange: DateRange, routineName: String, rateCache: PolicyPeriodFXRateCache,
                                                   line: PolicyLine, rateRoutineParameterMap: Map<CalcRoutineParamName, Object>, executor: HORateRoutineExecutor, numDaysInCoverageRatedTerm: int, chargePatternType : ChargePattern) : CostData {
    var costData = new HOTaxCostData_HOE(dateRange.start, dateRange.end, (line as HomeownersLine_HOE).PreferredCoverageCurrency, rateCache, chargePatternType)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    rateRoutineParameterMap.put(TC_COSTDATA, costData)
    executor.executeBasedOnSliceDate(routineName, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }
}