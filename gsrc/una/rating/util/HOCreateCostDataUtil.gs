package una.rating.util

uses gw.lob.ho.rating.ScheduleCovCostData_HOE
uses gw.lob.ho.rating.HOCostData_HOE
uses una.rating.ho.ratinginfos.HOLineRatingInfo
uses una.rating.ho.HODwellingRatingInfo
uses java.util.Map
uses una.rating.ho.ratinginfos.HODiscountsOrSurchargesRatingInfo
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.financials.PolicyPeriodFXRateCache
uses gw.rating.CostData
uses una.rating.ho.HomeownersLineCostData_HOE
uses una.rating.ho.HORateRoutineExecutor

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/4/16
 * Time: 11:28 AM
 */
class HOCreateCostDataUtil {



  /**
   *  Returns the parameter set for the line level coverages
   */
  private static function getLineCovParameterSet(line : PolicyLine, costData : HOCostData_HOE, lineRatingInfo : HOLineRatingInfo, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  /**
   * Returns the parameter set for the Dwelling level coverages
   */
  private static function getDwellingCovParameterSet(line : PolicyLine, costData : HOCostData_HOE, dwellingRatingInfo : HODwellingRatingInfo, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  /**
   * Returns the parameter set for the discounts or surcharges
   */
  private static function getDiscountOrSurchargeParameterSet(line : PolicyLine, costData : HOCostData_HOE, discountOrSurchargeRatingInfo : HODiscountsOrSurchargesRatingInfo, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo,
        TC_COSTDATA -> costData
    }
  }

  /**
   * creates cost data for the dwelling level coverages
   */
  public static function createCostDataForDwellingCoverage(dwellingCov : DwellingCov_HOE, dateRange : DateRange, dwellingRatingInfo : HODwellingRatingInfo, routineName : String, rateCache : PolicyPeriodFXRateCache,
                                                     line : PolicyLine, executor : HORateRoutineExecutor, numDaysInCoverageRatedTerm : int) : CostData{
    var costData = new DwellingCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, rateCache, dwellingCov.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(line, costData, dwellingRatingInfo, line.BaseState.Code)
    executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates cost data for the scheduled coverages
   */
  public static function createCostDataForScheduledCoverage(dwellingCov : DwellingCov_HOE, dateRange : DateRange, dwellingRatingInfo : HODwellingRatingInfo, routineName : String, item : ScheduledItem_HOE, rateCache : PolicyPeriodFXRateCache,
                                                      line : PolicyLine, executor : HORateRoutineExecutor, numDaysInCoverageRatedTerm : int) : CostData{
    var costData = new ScheduleCovCostData_HOE(dateRange.start, dateRange.end, dwellingCov.Currency, rateCache, dwellingCov.FixedId, item.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDwellingCovParameterSet(line, costData, dwellingRatingInfo, line.BaseState.Code)
    executor.execute(routineName, dwellingCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the cost data for the Line level coverages
   */
  public static function createCostDataForLineCoverages(lineCov : HomeownersLineCov_HOE, dateRange : DateRange, routineName : String, lineRatingInfo : HOLineRatingInfo, rateCache : PolicyPeriodFXRateCache,
                                                  line : PolicyLine, executor : HORateRoutineExecutor, numDaysInCoverageRatedTerm : int) : CostData{
    var costData = new HomeownersCovCostData_HOE(dateRange.start, dateRange.end, lineCov.Currency, rateCache, lineCov.FixedId)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getLineCovParameterSet(line, costData, lineRatingInfo, line.BaseState.Code)
    executor.execute(routineName, lineCov, rateRoutineParameterMap, costData)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }

  /**
   * creates the cost data for the discount or surcharges
   */
  public static function createCostDataForDiscountsOrSurcharges(dateRange : DateRange, routineName : String, discountOrSurchargeRatingInfo : HODiscountsOrSurchargesRatingInfo, costType : HOCostType_Ext, rateCache : PolicyPeriodFXRateCache,
                                                                line : PolicyLine, executor : HORateRoutineExecutor, numDaysInCoverageRatedTerm : int) : CostData{
    var costData = new HomeownersLineCostData_HOE(dateRange.start, dateRange.end, (line as HomeownersLine_HOE).PreferredCoverageCurrency, rateCache, costType)
    costData.init(line as HomeownersLine_HOE)
    costData.NumDaysInRatedTerm = numDaysInCoverageRatedTerm
    var rateRoutineParameterMap = getDiscountOrSurchargeParameterSet(line, costData, discountOrSurchargeRatingInfo, line.BaseState.Code)
    executor.executeBasedOnSliceDate(routineName, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.copyStandardColumnsToActualColumns()
    return costData
  }
}