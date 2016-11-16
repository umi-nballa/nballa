package una.rating.ho.common

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses gw.rating.CostData
uses una.rating.util.HOCreateCostDataUtil

uses java.util.Map
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/27/16
 * Class which implements the rate routines common to all the states
 */
class HOCommonRateRoutinesExecutor {
  /**
   * Rate Equipment breakdown coverage
   */
  static function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange, line: PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int): CostData {
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.EQUIPMENT_BREAKDOWN_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  static function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange, line: PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int): CostData {
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.IDENTITY_THEFT_EXPENSE_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate Refrigerated Personal Property coverage
   */
  static function rateRefrigeratedPersonalPropertyCoverage(dwellingCov: HODW_RefrigeratedPP_HOE_Ext, dateRange: DateRange, line: PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int): CostData {
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.REFRIGERATED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate seasonal or secondary residence surcharge
   */
  static function rateSeasonalOrSecondaryResidenceSurcharge(dateRange: DateRange, line: PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int, costType : HOCostType_Ext, discountOrSurchargeRatingInfo : HOCommonDiscountsOrSurchargeRatingInfo): CostData {
    var rateRoutineParameterMap = getHOCWDiscountsAndSurchargesParameterSet(line, discountOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.SEASONAL_OR_SECONDARY_RESIDENCE_SURCHARGE_RATE_ROUTINE, costType, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate ACV loss settlement on Roof surfacing for HO3 policy types
   */
  static function rateACVLossSettlementOnRoofSurfacing(dwellingCov: HODW_LossSettlementWindstorm_HOE_Ext, dateRange: DateRange, line : PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int, hoRatingInfo : HORatingInfo) : CostData{
    var rateRoutineParameterMap = getHOCommonRatingInfoParameterSet(line, hoRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ACV_LOSS_SETTLEMENT_ON_ROOF_SURFACING_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
 * Returns the parameter set for the country wide routines
 */
  static function getHOCWParameterSet(line: PolicyLine): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code
    }
  }

  /**
   * Returns the parameter set for the country wide routines for discounts and surcharges
   */
  static function getHOCWDiscountsAndSurchargesParameterSet(line: PolicyLine, discountOrSurchargeRatingInfo : HOCommonDiscountsOrSurchargeRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo,
        TC_STATE -> line.BaseState.Code
    }
  }

  /**
   * Returns the parameter set with a rating info
   */
  static function getHOCommonRatingInfoParameterSet(line: PolicyLine, hoRatingInfo : HORatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_RATINGINFO -> hoRatingInfo
    }
  }
}