package una.rating.ho.group1

uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.group1.ratinginfos.HORatingInfo
uses una.rating.ho.UNAHORatingEngine_HOE
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.util.HOCreateCostDataUtil
uses java.util.Map
uses una.rating.ho.group1.ratinginfos.HOGroup1LineRatingInfo
uses una.rating.ho.group1.ratinginfos.HOGroup1DwellingRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOGroup1RatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOGroup1RatingEngine.Type.DisplayName
  private var _hoRatingInfo: HORatingInfo

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterGroup1(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
    updateTotalBasePremium()
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOLI_Personal_Liability_HOE:
        rateIncreasedSectionIILimits(lineCov, dateRange)
        break
      case HOLI_AnimalLiabilityCov_HOE_Ext:
        rateAnimalLiabilityCoverage(lineCov, dateRange)
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
      case HODW_SpecialComp_HOE_Ext:
        rateSpecialComputerCoverage(dwellingCov, dateRange)
        break
      case HODW_WaterBackUpSumpOverflow_HOE_Ext:
        rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecificAddAmt_HOE_Ext:
        rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange)
        break
      case HODW_LossSettlementWindstorm_HOE_Ext:
        rateACVLossSettlementOnRoofSurfacing(dwellingCov, dateRange)
        break
      case HODW_Personal_Property_HOE:
        rateIncreasedPersonalProperty(dwellingCov, dateRange)
        break
      case HODW_OrdinanceCov_HOE:
        rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
        break
    }
  }

  /**
   * Function which rates the discounts and surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
  }

  /**
   * Rate Equipment breakdown coverage
   */
  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOCWParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.EQUIPMENT_BREAKDOWN_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup1DwellingRatingInfo(dwellingCov)
    if (dwellingRatingInfo.IsPersonalPropertyIncreasedLimit){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_GROUP1_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Rrdinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
    if(dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOEExists){
      if(dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.DisplayValue == "25%"){
        var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState.Code)
        var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_GROUP1_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
        if (costData != null)
          addCost(costData)
      }
    }
    _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate ACV loss settlement on Roof surfacing for HO3 policy types
   */
  function rateACVLossSettlementOnRoofSurfacing(dwellingCov: HODW_LossSettlementWindstorm_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateACVLossSettlementOnRoofSurfacing to rate ACV loss settlement on roof surfacing", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ACV_LOSS_SETTLEMENT_ON_ROOF_SURFACING_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("ACV loss settlement on Roof Surfacing Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Refrigerated Personal Property coverage
   */
  function rateRefrigeratedPersonalPropertyCoverage(dwellingCov: HODW_RefrigeratedPP_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateRefrigeratedPersonalPropertyCoverage to rate Refrigerated Personal Property Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOCWParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.REFRIGERATED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Refrigerated Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Special Computer coverage
   */
  function rateSpecialComputerCoverage(dwellingCov: HODW_SpecialComp_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialComputerCoverage to rate Special Computer Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOCWParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_COMPUTER_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Special Computer Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Water backup Sump Overflow coverage
   */
  function rateWaterBackupSumpOverflowCoverage(dwellingCov: HODW_WaterBackUpSumpOverflow_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateWaterBackupSumpOverflowCoverage to rate Water Backup Sump Overflow Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOCWParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.WATER_BACKUP_SUMP_OVERFLOW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup1DwellingRatingInfo(dwellingCov)
    if(dwellingRatingInfo.SpecifiedAdditionalAmount != ""){
      dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_GROUP1_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIdentityTheftExpenseCoverage to rate Identity Theft Expense Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOCWParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.IDENTITY_THEFT_EXPENSE_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Identity Theft Expense Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov: HOLI_AnimalLiabilityCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup1LineRatingInfo (lineCov)
    if(lineRatingInfo.AnimalLiabilityLimit != 0){
      var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_GROUP1_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Animal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Increased Section II Limits
   */
  function rateIncreasedSectionIILimits(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedSectionIILimits to rate Increased Section II Limits", this.IntrinsicType)
    var lineRatingInfo = new HOGroup1LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.INCREASED_SECTION_II_LIMITS_GROUP1_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Increased Section II Limits Rated Successfully", this.IntrinsicType)
  }

  /*private function addWorksheetForCoverage(coverage : EffDated, costData : HOCostData_HOE){
    if(Plugins.get(IRateRoutinePlugin).worksheetsEnabledForLine(PolicyLine.PatternCode)){
      var worksheet = new Worksheet(){ :WorksheetEntries = costData.WorksheetEntries }
      PolicyLine.Branch.addWorksheetFor(coverage, worksheet)
    }
  }*/

  /**
   * Returns the parameter set for the country wide routines
   */
  private function getHOCWParameterSet(line : PolicyLine, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode
    }
  }

  /**
   * Returns the parameter set for the country wide routines
   */
  private function getHOParameterSet(line : PolicyLine, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_RATINGINFO -> _hoRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line : PolicyLine, lineRatingInfo : HOGroup1LineRatingInfo, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getDwellingCovParameterSet(line : PolicyLine, dwellingRatingInfo : HOGroup1DwellingRatingInfo, stateCode : String) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium = (_hoRatingInfo.AdjustedBaseClassPremium)
  }
}