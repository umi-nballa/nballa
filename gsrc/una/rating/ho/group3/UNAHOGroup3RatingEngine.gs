package una.rating.ho.group3

uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.group3.ratinginfos.HORatingInfo
uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.group3.ratinginfos.HOGroup3LineRatingInfo
uses java.util.Map
uses java.math.BigDecimal
uses una.rating.ho.group3.ratinginfos.HOGroup3DwellingRatingInfo
uses una.rating.ho.common.HOOtherStructuresRatingInfo
uses una.rating.ho.common.HOSpecialLimitsPersonalPropertyRatingInfo
uses una.rating.ho.group3.ratinginfos.HOGroup3DiscountsOrSurchargeRatingInfo
uses una.config.ConfigParamsUtil
uses com.sun.java.swing.plaf.windows.resources.windows

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOGroup3RatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOGroup3RatingEngine.Type.DisplayName
  private var _hoRatingInfo : HORatingInfo
  private var _discountsOrSurchargeRatingInfo : HOGroup3DiscountsOrSurchargeRatingInfo
  private final var BCEG_CODE_FOR_NON_PARTICIPATION = "98"

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
    var rater = new HOBasePremiumRaterGroup3(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
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
      case HOPS_GolfCartPD_HOE_Ext:
        rateGolfCartPhysicalDamageAndLiabilityCoverage(lineCov, dateRange)
        break
      case HOLI_Personal_Liability_HOE:
        rateIncreasedSectionIILimits(lineCov, dateRange)
        break
      case HOLI_FungiCov_HOE:
        rateLimitedFungiWetOrDryRotOrBacteriaSectionIICoverage(lineCov, dateRange)
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
        if(dwellingCov.HODW_PersonalPropertyLimit_HOETerm.LimitDifference > 0)
          rateIncreasedPersonalProperty(dwellingCov, dateRange)
        break
      case HODW_BusinessProperty_HOE_Ext:
        rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
        break
      case HODW_Other_Structures_HOE:
        rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
        break
      case HODW_LossAssessmentCov_HOE_Ext:
        rateLossAssessmentCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecialComp_HOE_Ext:
        //rateSpecialComputerCoverage(dwellingCov, dateRange)
        break
      case HODW_SinkholeLoss_HOE_Ext:
        rateSinkholeLossCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecificAddAmt_HOE_Ext:
        rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecialLimitsPP_HOE_Ext:
        rateSpecialLimitsPersonalPropertyCoverage(dwellingCov, dateRange)
        break
      case HODW_OrdinanceCov_HOE:
        rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
        break
      case HODW_LimitedScreenCov_HOE_Ext:
        rateLimitedScreenedEnclosureAndCarportCoverage(dwellingCov, dateRange)
        break
      case HODW_FungiCov_HOE:
        rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov, dateRange)
        break
      case HODW_ScheduledProperty_HOE:
        //rateScheduledPersonalProperty(dwellingCov, dateRange)
        break
      case HODW_Dwelling_Cov_HOE:
        if (dwellingCov.HODW_ExecutiveCov_HOE_ExtTerm.Value)
          rateExecutiveCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecificOtherStructure_HOE_Ext:
        rateOtherStructuresRentedToOthersCoverage(dwellingCov, dateRange)
        break
    }
  }

  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
    var dwelling = PolicyLine.Dwelling
    _discountsOrSurchargeRatingInfo = new HOGroup3DiscountsOrSurchargeRatingInfo(PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
    var windOrHailExcluded = _discountsOrSurchargeRatingInfo.WindOrHailExcluded

    if(dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT){
      rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNTAOPPREMIUM)
    }
    if (dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEAS || dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC){
      rateSeasonalOrSecondaryResidenceSurcharge(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGEAOPPREMIUM)
    }
    if(isMatureHomeOwnerDiscountApplicable(PolicyLine)){
      rateMatureHomeOwnerDiscount(dateRange, HOCostType_Ext.TC_MATUREHOMEOWNERDISCOUNT)
    }
    rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGE, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE)
    rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.AdjustedAOPBasePremium, HOCostType_Ext.TC_DEDUCTIBLEFACTORAOP)
    if(PolicyLine.Branch.PreferredBuilder_Ext != null and _discountsOrSurchargeRatingInfo.AgeOfHome < 10)
      ratePreferredBuilderCredit(dateRange)

    //rating all wind hail included, credit and discounts
    if(!windOrHailExcluded){
      rateHigherAllPerilDeductible(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_DEDUCTIBLEFACTORWIND)
      if(dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT)
        rateSuperiorConstructionDiscount(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNTWINDPREMIUM)
      if(dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEAS || dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC)
        rateSeasonalOrSecondaryResidenceSurcharge(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGEWINDPREMIUM)
      if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3)
        rateAgeOfHomeDiscount(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_AGEOFHOMEPREMIUMMODIFIER, HORateRoutineNames.AGE_OF_HOME_PREMIUM_MODIFIER_RATE_ROUTINE)
      /*if(dwelling?.HOLocation?.BCEG_Ext == BCEG_CODE_FOR_NON_PARTICIPATION)
        rateBuildingCodeNonParticipatingRisks(dateRange, _hoRatingInfo.WindBasePremium, HOCostType_Ext.TC_BUILDINGCODENONPARTICIPATINGRISKSSURCHARGE)*/
    }

    updateWindBasePremium()

    if(!windOrHailExcluded){
      rateBuildingCodeComplianceGradingCredit(dateRange, _hoRatingInfo.AdjustedWindBasePremium, HOCostType_Ext.TC_BUILDINGCODECOMPLIANCEGRADECREDIT)
    }

    rateMaximumDiscountAdjustmentForAOP(dateRange)

    updateFinalAdjustedAOPBasePremium()

    //TODO : Need to update the final adjusted wind premium
    _hoRatingInfo.TotalBasePremium = _hoRatingInfo.FinalAdjustedAOPBasePremium + _hoRatingInfo.FinalAdjustedWindBasePremium

    if(dwelling.HOLine.HODW_PersonalPropertyExc_HOE_ExtExists){
      ratePersonalPropertyExclusion(dwelling.HOLine.HODW_PersonalPropertyExc_HOE_Ext, dateRange)
    }
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
      var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
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
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Golf Cart Physical Damage And Liability coverage
   */
  function rateGolfCartPhysicalDamageAndLiabilityCoverage(lineCov: HOPS_GolfCartPD_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateGolfCartPhysicalDamageAndLiabilityCoverage to rate Golf Cart Physical Damage And Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.GOLF_CART_PHYSICAL_DAMAGE_AND_LIABILITY_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Golf Cart Physical Damage And Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Limited Fungi Wet Or Dry Rot Or Bacteria SectionII Coverage
   */
  function rateLimitedFungiWetOrDryRotOrBacteriaSectionIICoverage(lineCov: HOLI_FungiCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedFungiWetOrDryRotOrBacteriaSectionIICoverage to rate Limited Fungi Wet Or Dry Rot Or Bacteria SectionII Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONII_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Limited Fungi Wet Or Dry Rot Or Bacteria SectionII Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Increased Section II Limits
   */
  function rateIncreasedSectionIILimits(lineCov: HOLI_Personal_Liability_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedSectionIILimits to rate Increased Section II Limits", this.IntrinsicType)
    var lineRatingInfo = new HOGroup3LineRatingInfo (lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.INCREASED_SECTION_II_LIMITS_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount != 0)
      addCost(costData)
    _logger.debug("Increased Section II Limits Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
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
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
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
    var otherStructuresRatingInfo = new HOOtherStructuresRatingInfo(dwellingCov)
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
   * Rate the Loss assessment Coverage
   */
  function rateLossAssessmentCoverage(dwellingCov: HODW_LossAssessmentCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    if(dwellingRatingInfo.LossAssessmentLimit != 1000){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Loss Asssessment Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Special Computer coverage
   * TODO : update the special computer coverage when the limit is made available on the UI screen
   */
  function rateSpecialComputerCoverage(dwellingCov: HODW_SpecialComp_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialComputerCoverage to rate Special Computer Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_COMPUTER_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Special Computer Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Loss assessment Coverage
   */
  function rateSinkholeLossCoverage(dwellingCov: HODW_SinkholeLoss_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSinkholeLossCoverage to rate Sinkhole Loss Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SINKHOLE_LOSS_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Sinkhole Loss Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Special Limits Personal property coverage
   */
  function rateSpecialLimitsPersonalPropertyCoverage(dwellingCov: HODW_SpecialLimitsPP_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialLimitsPersonalPropertyCoverage to rate Special Limits Personal Property Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getSpecialLimitsPersonalPropertyCovParameterSet(PolicyLine, dwellingCov)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_LIMITS_PERSONAL_PROPERTY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Special Limits Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Personal Property Exclusion
   */
  function ratePersonalPropertyExclusion(personalPropertyExcl : HODW_PersonalPropertyExc_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyExclusion", this.IntrinsicType)
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_PERSONALPROPERTYEXCLUSIONBASELIMIT_EXT -> _hoRatingInfo.TotalBasePremium
    }
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PERSONAL_PROPERTY_EXCLUSION_RATE_ROUTINE, HOCostType_Ext.TC_PERSONALPROPERTYEXCLUSION,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Property Exclusion Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Superior Construction Discount
   */
  function rateSuperiorConstructionDiscount(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSuperiorConstructionDiscount", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.SUPERIOR_CONSTRUCTION_DISCOUNT_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.SuperiorConstructionDiscountForAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.SuperiorConstructionDiscountForWind = costData?.ActualTermAmount
    }
    _logger.debug("Superior Construction Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Mature Homeowner Discount
   */
  function rateMatureHomeOwnerDiscount(dateRange: DateRange, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateMatureHomeOwnerDiscount", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedAOPBasePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.MATURE_HOME_OWNER_DISCOUNT_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.MatureHomeOwnerDiscountAOP = costData.ActualTermAmount
    }
    _logger.debug("Mature Home owner Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Age of Home Discount or Surcharge
   */
  function rateAgeOfHomeDiscount(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext, routineName : String) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAgeOfHomeDiscount", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, routineName, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.AgeOfHomeDiscountAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.AgeOfHomeDiscountWind = costData?.ActualTermAmount
    }
    _logger.debug("Age Of Home Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Deductible Factor
   */
  function rateHigherAllPerilDeductible(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateHigherAllPerilDeductible", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.HigherAllPerilDeductibleAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.HigherAllPerilDeductibleWind = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Higher All Peril Deductible Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Preferred Builder Credit
   */
  function ratePreferredBuilderCredit(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePreferredBuilderCredit", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedAOPBasePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PREFERRED_BUILDER_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_PREFERREDBUILDERCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.PreferredBuilderCredit = costData?.ActualTermAmount
    }
    _logger.debug("Preferred Builder Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Building Code Non Participating Risks
   */
  function rateBuildingCodeNonParticipatingRisks(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingCodeNonParticipatingRisks", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BUILDING_CODE_NON_PARTICIPATING_RISKS_SURCHARGE_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.BuildingCodeNonParticipatingRisksSurcharge = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Building Code Non Participating Risks Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Building Code Compliance Grading Credit
   */
  function rateBuildingCodeComplianceGradingCredit(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingCodeComplianceGradingCredit", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BUILDING_CODE_COMPLIANCE_GRADING_CREDIT_RATE_ROUTINE, costType,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.BuildingCodeComplianceGradingCredit = costData?.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Building Code Compliance Grading Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Seasonal Or Secondary Residence Surcharge
   */
  function rateSeasonalOrSecondaryResidenceSurcharge(dateRange: DateRange, basePremium : BigDecimal, costType : HOCostType_Ext) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSeasonalOrSecondaryResidenceSurcharge", this.IntrinsicType)
    _discountsOrSurchargeRatingInfo.TotalBasePremium = basePremium
    var costData = HOCommonRateRoutinesExecutor.rateSeasonalOrSecondaryResidenceSurcharge(dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, costType, _discountsOrSurchargeRatingInfo)
    if (costData != null){
      addCost(costData)
      if(_discountsOrSurchargeRatingInfo.WindOrHailExcluded)
        _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForAOP = costData?.ActualTermAmount
      else
        _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForWind = costData?.ActualTermAmount
    }
    _logger.debug("Seasonal And Secondary Residence Surcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    dwellingRatingInfo.PPIncreasedLimit = dwellingCov.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Limited Screened Enclosure And Carport
   */
  function rateLimitedScreenedEnclosureAndCarportCoverage(dwellingCov: HODW_LimitedScreenCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedScreenedEnclosureAndCarportCoverage", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getRatingInfoParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LIMITED_SCREENED_ENCLOSURE_AND_CARPORT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Limited Screened Enclosure And Carport Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage
   */
  function rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov: HODW_FungiCov_HOE, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage ", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONI_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Other Structures Rented To Others Coverage
   */
  function rateOtherStructuresRentedToOthersCoverage(dwellingCov: HODW_SpecificOtherStructure_HOE_Ext, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresRentedToOthersCoverage ", this.IntrinsicType)
    var dwellingRatingInfo = new HOGroup3DwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_RENTED_TO_OTHERS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Other Structures Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Executive Coverage
   */
  function rateExecutiveCoverage(dwellingCov: HODW_Dwelling_Cov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateExecutiveCoverage to rate Executive Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCommonRatingInfoParameterSet(PolicyLine, _hoRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.EXECUTIVE_COVERAGE_RATE_ROUTINE, HOCostType_Ext.TC_EXECUTIVECOVERAGE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Executive Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Scheduled Personal property
   * TODO : Update the scheduled personal property after the mapping to the item type is done
   */
  function rateScheduledPersonalProperty(dwellingCov: HODW_ScheduledProperty_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateScheduledPersonalProperty to rate Personal Property Scheduled Coverage", this.IntrinsicType)
    for (item in dwellingCov.ScheduledItems) {
      var rateRoutineParameterMap = getScheduledPersonalPropertyCovParameterSet(PolicyLine, item)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SCHEDULED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Scheduled Personal Property Coverage Rated Successfully", this.IntrinsicType)
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
  *  Returns the parameter set with rating info and dwelling rating info
  */
  private function getRatingInfoParameterSet(line : PolicyLine, dwellingRatingInfo : HOGroup3DwellingRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_RATINGINFO -> _hoRatingInfo
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

  /**
   * Returns the parameter set for the Special Limits Personal Property Cov
   */
  private function getSpecialLimitsPersonalPropertyCovParameterSet(line : PolicyLine, dwellingCov : HODW_SpecialLimitsPP_HOE_Ext) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_SPECIALLIMITSPERSONALPROPERTYRATINGINFO_Ext -> new HOSpecialLimitsPersonalPropertyRatingInfo(dwellingCov)
    }
  }

  /**
   * Returns the parameter set for the Discounts / surcharges
   */
  private function getHOLineDiscountsOrSurchargesParameterSet(line : PolicyLine, discountOrSurchargeRatingInfo : HOGroup3DiscountsOrSurchargeRatingInfo) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> line.BaseState.Code,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Scheduled Personal Property Cov
   */
  private function getScheduledPersonalPropertyCovParameterSet(line: PolicyLine, item: ScheduledItem_HOE): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_SCHEDULEDPERSONALPROPERTYRATINGINFO_Ext -> null//new HOScheduledPersonalPropertyRatingInfo(item)
    }
  }

  /**
   * Return true if the primary named insured or additional named insured age is greater than or equal to 60yrs.
  */
  private function isMatureHomeOwnerDiscountApplicable(line: HomeownersLine_HOE) : boolean {
    var period = line.Dwelling.PolicyPeriod
    var dateOfBirth : java.util.Date = null
    var minAgeLimit = ConfigParamsUtil.getInt(TC_MATUREHOMEOWNERMINIMUMAGE, line.Dwelling.CoverableState, line.HOPolicyType.Code)
    var primaryNamedInsured = period.PolicyContactRoles.whereTypeIs(PolicyPriNamedInsured).first()
    if(primaryNamedInsured != null){
      dateOfBirth = primaryNamedInsured.DateOfBirth
      if(dateOfBirth != null and (determineAge(dateOfBirth?.YearOfDate) >= minAgeLimit))
        return true
    }
    var additionalNamedInsured = period.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)
    for(addlInsured in additionalNamedInsured){
      dateOfBirth = addlInsured.DateOfBirth
      if(dateOfBirth != null and (determineAge(dateOfBirth?.YearOfDate) >= minAgeLimit))
        return true
    }
    return false
  }

  /**
   * Adjusting the total discount if it exceeds the maximum discount
   */
  function rateMaximumDiscountAdjustmentForAOP(dateRange: DateRange) {
    var totalDiscountAmount = _hoRatingInfo.SuperiorConstructionDiscount + _hoRatingInfo.TownHouseOrRowHouseSurchargeAOP + _hoRatingInfo.ProtectiveDevicesDiscount +
                              _hoRatingInfo.PreferredBuilderCredit + _hoRatingInfo.MatureHomeOwnerDiscountAOP + _hoRatingInfo.NoPriorInsurance + _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForAOP
    if (_hoRatingInfo.AgeOfHomeDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.AgeOfHomeDiscount
    if (_hoRatingInfo.HigherAllPerilDeductibleAOP < 0)
      totalDiscountAmount += _hoRatingInfo.HigherAllPerilDeductibleAOP
    _hoRatingInfo.DiscountAdjustment = rateMaximumDiscountAdjustment(dateRange, totalDiscountAmount, _hoRatingInfo.AdjustedBaseClassPremium)
  }

  private function determineAge(year : int) : int{
    return PolicyLine.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate - year
  }

  private function updateWindBasePremium(){
    _hoRatingInfo.AdjustedWindBasePremium = _hoRatingInfo.WindBasePremium + _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForWind + _hoRatingInfo.TownHouseOrRowHouseSurchargeWind +
                                            _hoRatingInfo.AgeOfHomeDiscountWind + _hoRatingInfo.BuildingCodeNonParticipatingRisksSurcharge + _hoRatingInfo.SuperiorConstructionDiscountForWind +
                                            _hoRatingInfo.HigherAllPerilDeductibleWind
  }

  private function updateFinalAdjustedAOPBasePremium(){
    _hoRatingInfo.FinalAdjustedAOPBasePremium = _hoRatingInfo.AdjustedAOPBasePremium + _hoRatingInfo.NoPriorInsurance + _hoRatingInfo.SuperiorConstructionDiscountForAOP + _hoRatingInfo.TownHouseOrRowHouseSurchargeAOP +
                                                _hoRatingInfo.ProtectiveDevicesDiscount + _hoRatingInfo.HigherAllPerilDeductibleAOP + _hoRatingInfo.AgeOfHomeDiscountAOP + _hoRatingInfo.SeasonalSecondaryResidenceSurchargeForAOP +
                                                _hoRatingInfo.PreferredBuilderCredit + _hoRatingInfo.MatureHomeOwnerDiscountAOP + _hoRatingInfo.DiscountAdjustment
  }
}