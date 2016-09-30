package una.rating.ho.group3

uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.group3.ratinginfos.HORatingInfo
uses una.rating.ho.UNAHORatingEngine_HOE
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.group3.ratinginfos.HOGroup3LineRatingInfo
uses java.util.Map
uses gw.api.domain.covterm.CovTerm
uses java.math.BigDecimal
uses una.rating.ho.group3.ratinginfos.HOGroup3DwellingRatingInfo
uses una.rating.ho.common.HOOtherStructuresRatingInfo
uses una.rating.ho.common.HOPersonalPropertyRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOGroup3RatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOGroup3RatingEngine.Type.DisplayName
  private var _hoRatingInfo: HORatingInfo
  private var _limitDifferences : Map<CovTerm, BigDecimal>

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    var period = line.Dwelling?.PolicyPeriod
    _limitDifferences = period.HomeownersLine_HOE.Dwelling.LimitDifferences
  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOLI_AnimalLiabilityCov_HOE_Ext:
        rateAnimalLiabilityCoverage(lineCov, dateRange)
        break
      case HOLI_PersonalInjury_HOE:
        ratePersonalInjuryCoverage(lineCov, dateRange)
        break
    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    switch (typeof dwellingCov) {
      case HODW_EquipBreakdown_HOE_Ext:
        rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
        break
      case HODW_IdentityTheftExpenseCov_HOE_Ext:
        rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
        break
      case HODW_RefrigeratedPP_HOE_Ext:
        rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange)
        break
      case HODW_WaterBackUpSumpOverflow_HOE_Ext:
        rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
        break
      case HODW_Personal_Property_HOE:
        rateIncreasedPersonalProperty(dwellingCov, dateRange)
        break
      case HODW_BusinessProperty_HOE_Ext:
        rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
        break
      case HODW_Other_Structures_HOE:
        rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
        break
    }
  }

  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
  }

  /**
   * Rate Equipment breakdown coverage
   */
  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIdentityTheftExpenseCoverage to rate Identity Theft Expense Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateIdentityTheftExpenseCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Identity Theft Expense Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Refrigerated Personal Property coverage
   */
  function rateRefrigeratedPersonalPropertyCoverage(dwellingCov: HODW_RefrigeratedPP_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateRefrigeratedPersonalPropertyCoverage to rate Refrigerated Personal Property Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Refrigerated Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Water backup Sump Overflow coverage
   */
  function rateWaterBackupSumpOverflowCoverage(dwellingCov: HODW_WaterBackUpSumpOverflow_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateWaterBackupSumpOverflowCoverage to rate Water Backup Sump Overflow Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.WATER_BACKUP_SUMP_OVERFLOW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov: HOLI_AnimalLiabilityCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    if(lineRatingInfo.AnimalLiabilityLimit != 0){
      var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_GROUP3_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Animal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate personal injury line coverage
   */
  function ratePersonalInjuryCoverage(lineCov: HOLI_PersonalInjury_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalInjury to rate Personal Injury Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, null)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_GROUP3_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var limitDifference = _limitDifferences.get(dwellingCov.HODW_PersonalPropertyLimit_HOETerm)
    var personalPropertyRatingInfo = new HOPersonalPropertyRatingInfo(limitDifference)
    if (personalPropertyRatingInfo.IsPersonalPropertyIncreasedLimit){
      var rateRoutineParameterMap = getPersonalPropertyCovParameterSet(PolicyLine, personalPropertyRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null){
        addCost(costData)
      }
    }
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Business property - Increased Limits
   */
  function rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov : HODW_BusinessProperty_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBusinessPropertyIncreasedLimitsCoverage to rate Business Property Increased Limits Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    if(dwellingRatingInfo.BusinessPropertyIncreasedLimit > 0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_GROUP3_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Other structures - Increased or decreased Limits coverage
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: HODW_Other_Structures_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var limitDifference = _limitDifferences.get(dwellingCov.HODW_OtherStructures_Limit_HOETerm)
    var otherStructuresRatingInfo = new HOOtherStructuresRatingInfo(limitDifference)
    if(otherStructuresRatingInfo.IsOtherStructuresIncreasedOrDecreasedLimit){
      var rateRoutineParameterMap = getOtherStructuresCovParameterSet(PolicyLine, otherStructuresRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null){
        addCost(costData)
      }
    }
    _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line : PolicyLine, lineRatingInfo : HOGroup3LineRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the Dwelling coverages
   */
  private function getDwellingCovParameterSet(line : PolicyLine, dwellingRatingInfo : HOGroup3DwellingRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Personal Property
   */
  private function getPersonalPropertyCovParameterSet(line : PolicyLine, personalPropertyRatingInfo : HOPersonalPropertyRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_DWELLINGRATINGINFO_EXT -> personalPropertyRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Other structures
   */
  private function getOtherStructuresCovParameterSet(line : PolicyLine, otherStructuresRatingInfo : HOOtherStructuresRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> otherStructuresRatingInfo
    }
  }
}