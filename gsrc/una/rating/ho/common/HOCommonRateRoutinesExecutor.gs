package una.rating.ho.common

uses java.util.Map
uses gw.lob.common.util.DateRange
uses una.rating.util.HOCreateCostDataUtil
uses gw.financials.PolicyPeriodFXRateCache
uses gw.rating.CostData

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
  static function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange, line : PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int) : CostData{
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.EQUIPMENT_BREAKDOWN_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  static function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange, line : PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int) : CostData {
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.IDENTITY_THEFT_EXPENSE_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate Refrigerated Personal Property coverage
   */
  static function rateRefrigeratedPersonalPropertyCoverage(dwellingCov: HODW_RefrigeratedPP_HOE_Ext, dateRange: DateRange, line : PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int) : CostData{
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.REFRIGERATED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Rate Special Computer coverage
   */
  static function rateSpecialComputerCoverage(dwellingCov: HODW_SpecialComp_HOE_Ext, dateRange: DateRange, line : PolicyLine, executor: HORateRoutineExecutor, rateCache: PolicyPeriodFXRateCache, numDaysInCoverageRatedTerm: int) : CostData {
    var rateRoutineParameterMap = getHOCWParameterSet(line)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_COMPUTER_COV_ROUTINE_NAME, rateCache, line, rateRoutineParameterMap, executor, numDaysInCoverageRatedTerm)
    return costData
  }

  /**
   * Returns the parameter set for the country wide routines
   */
  static function getHOCWParameterSet(line : PolicyLine) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code
    }
  }
}