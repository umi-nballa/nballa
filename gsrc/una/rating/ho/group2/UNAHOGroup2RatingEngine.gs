package una.rating.ho.group2

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.group1.ratinginfos.HOGroup1LineRatingInfo
uses una.rating.ho.group2.ratinginfos.HOGroup2DiscountsOrSurchargeRatingInfo
uses una.rating.ho.group2.ratinginfos.HORatingInfo
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HOOtherStructuresRatingInfo


uses java.util.Map
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.ho.group2.ratinginfos.HOGroup2DwellingRatingInfo
uses una.rating.ho.group2.ratinginfos.HOGroup2LineRatingInfo

uses una.rating.ho.common.HOSpecialLimitsPersonalPropertyRatingInfo
uses una.rating.ho.common.HOScheduledPersonalPropertyRatingInfo
uses una.rating.ho.group2.ratinginfos.HOOutboardMotorsAndWatercraftRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 * Time: 6:30 PM
 */
class UNAHOGroup2RatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOGroup2RatingEngine.Type.DisplayName
  private var _hoRatingInfo: HORatingInfo
  private var _discountsOrSurchargeRatingInfo : HOGroup2DiscountsOrSurchargeRatingInfo
  private var _lineRateRoutineParameterMap : Map<CalcRoutineParamName, Object>
  private var _lineRatingInfo : HOGroup2LineRatingInfo
  private var _dwellingRatingInfo : HOGroup2DwellingRatingInfo

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _lineRatingInfo = new HOGroup2LineRatingInfo(line)
    _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
    _dwellingRatingInfo = new HOGroup2DwellingRatingInfo(line.Dwelling)
  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterGroup2(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)

  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOLI_FungiCov_HOE:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONII_COV_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_Personal_Liability_HOE:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.INCREASED_SECTION_II_LIMITS_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_AnimalLiabilityCov_HOE_Ext:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_PersonalInjury_HOE:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOSL_OutboardMotorsWatercraft_HOE_Ext:
          rateOutboardMotorsAndWatercraftCoverage(lineCov, dateRange)
          break

    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    switch (typeof dwellingCov) {
      //case HODW_LossSettlementWindstorm_HOE_Ext:
          //rateACVLossSettlementOnRoofSurfacing(dwellingCov, dateRange)
          //break
      case HODW_OrdinanceCov_HOE:
          rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
          break
      case HODW_Personal_Property_HOE:
          if (dwellingCov.HODW_PersonalPropertyLimit_HOETerm.LimitDifference > 0)
            rateIncreasedPersonalProperty(dwellingCov, dateRange)
          break
      case HODW_BusinessProperty_HOE_Ext:
          rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
          break
      case HODW_FungiCov_HOE:
          rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov, dateRange)
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
      case HODW_IdentityTheftExpenseCov_HOE_Ext:
          rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
          break
      case HODW_EquipBreakdown_HOE_Ext:
          rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecificAddAmt_HOE_Ext:
            rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecialLimitsPP_HOE_Ext:
          rateSpecialLimitsPersonalPropertyCoverage(dwellingCov, dateRange)
          break
      case HODW_PermittedIncOcp_HOE_Ext:
          ratePermittedIncidentalOccupanciesCoverage(dwellingCov, dateRange)
          break
      case HODW_ScheduledProperty_HOE:
          rateScheduledPersonalProperty(dwellingCov, dateRange)
          break
      case HODW_BuildingAdditions_HOE_Ext:
          if(dwellingCov.HODW_BuildAddInc_HOETerm.LimitDifference > 0){
            rateBuildingAdditionsCoverage(dwellingCov, dateRange)
          }
          else
            rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov, dateRange)
          break
      case HODW_Other_Structures_HOE:
          rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
          break
      case HODW_SpecificOtherStructure_HOE_Ext:
          rateOtherStructuresRentedToOthersCoverage(dwellingCov, dateRange)
          break
      case HODW_LossAssessmentCov_HOE_Ext:
          rateLossAssessmentCoverage(dwellingCov, dateRange)
          break
      case HODW_UnitOwnersCovASpecialLimits_HOE_Ext:
            rateUnitOwnerCovASpecialLimitsCoverage(dwellingCov, dateRange)
          break
      }
    }


  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
    var dwelling = PolicyLine.Dwelling
    _discountsOrSurchargeRatingInfo = new HOGroup2DiscountsOrSurchargeRatingInfo(PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
    var constructionType = dwelling.OverrideConstructionType_Ext? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
    if (constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT){
      rateSuperiorConstructionDiscount(dateRange)
    }
    if (dwelling.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3){
      rateAgeOfHomeDiscount(dateRange)
    }
    if ((dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC) and dwelling.HOPolicyType != typekey.HOPolicyType_HOE.TC_HO4){
      rateSeasonalOrSecondaryResidenceSurcharge(dateRange)
    }
    if(PolicyLine.BaseState == Jurisdiction.TC_SC){
      rateProtectiveDeviceCredit(dateRange)
    }

    if(PolicyLine.MultiPolicyDiscount_Ext){
      _discountsOrSurchargeRatingInfo.TypeOfPolicyForMultiLine = PolicyLine.TypeofPolicy_Ext
      rateMultiLineDiscount(dateRange)
    }

     rateBuildingCodeEffectivenessGradingCredit(dateRange)

     rateLossHistoryCredit(dateRange)

    if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
        _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6 ||
        (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 and PolicyLine.BaseState == Jurisdiction.TC_SC)){
      if (PolicyLine.Branch.QualifiesAffinityDisc_Ext) {
        rateAffinityDiscount(dateRange)
      }
    }

    if(_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 and dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
      _discountsOrSurchargeRatingInfo.NumOfUnitsWithinFireDivision = dwelling?.NumUnitsFireDivision_Ext.Numeric? dwelling?.NumUnitsFireDivision_Ext.toInt() : 0
      rateTownhouseOrRowhouseSurcharge(dateRange)
    }

    //TODO fix coding
    if (dwelling?.HODW_Personal_Property_HOEExists){
      if (dwelling?.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm?.Value == tc_PersProp_ReplCost){
        ratePersonalPropertyReplacementCost(dateRange)
      }
    }

    if(dwelling.DwellingProtectionDetails.GatedCommunity){
      rateGatedCommunityDiscount(dateRange)
    }

    if(PolicyLine.HOPolicyType != HOPolicyType_HOE.TC_HO4 and !dwelling.WHurricaneHailExclusion_Ext)
      rateWindStormMitigationCredit(dateRange)

    rateHigherAllPerilDeductible(dateRange)

    rateMaximumDiscountAdjustment(dateRange)

    updateTotalBasePremium()
  }

  /**
   * Rate Building Additions Coverage
   */
  function rateBuildingAdditionsCoverage(dwellingCov: HODW_BuildingAdditions_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingAdditionsCoverage to rate Building Additions Coverage", this.IntrinsicType)
    _dwellingRatingInfo.BuildingAdditionsAndAlterationsLimit = dwellingCov.HODW_BuildAddInc_HOETerm.Value
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUILDING_ADDITIONS_AND_ALTERATIONS_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Building Additions and Alterations Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Building Additions And Alterations Increased Limits Coverage
   */
  function rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov: HODW_BuildingAdditions_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState.Code, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUILDING_ADDITIONS_AND_ALTERATIONS_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Building Additions And Alterations Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Deductible Factor
   */
  function rateHigherAllPerilDeductible(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateHigherAllPerilDeductible", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE, HOCostType_Ext.TC_HIGHERALLPERILDEDUCTIBLE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.HigherAllPerilDeductible = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    _logger.debug("Higher All Peril Deductible Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate Loss History Credit/Surcharge
   */
  function rateLossHistoryCredit(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateLossHistoryCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.LOSS_HISTORY_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_LOSSHISTORYCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.LossHistoryRatingPlan = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Loss History Credit Rated Successfully", this.IntrinsicType)
  }

  /**
    *   Function to rate Unit Owners Cov A Special Limits
   */

  function rateUnitOwnerCovASpecialLimitsCoverage(dwellingCov: HODW_UnitOwnersCovASpecialLimits_HOE_Ext , dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnerCovASpecialLimitsCoverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.UNIT_OWNERS_COVA_SPECIAL_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("rateUnitOwnerCovASpecialLimitsCoverage Rated Successfully", this.IntrinsicType)

  }

  /**
   *  Function to rate the Gated Community discount
   */
  function rateGatedCommunityDiscount(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateGatedCommunityDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.GATED_COMMUNITY_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_GATEDCOMMUNITYDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.GatedCommunityDiscount = costData?.ActualTermAmount
    if (costData != null){
      addCost(costData)
    }
    _logger.debug("Gated Community Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the windstorm mitigation credit
   */
  function rateWindStormMitigationCredit(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateWindStormMitigationCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.WINDSTORM_MITIGATION_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_WINDSTORMMITIGATIONCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.WindstormMitigationCredit = costData?.ActualTermAmount
    if (costData != null){
      addCost(costData)
    }
    _logger.debug("Windstorm Mitigation Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Building Code Effectiveness Grading Credit
   */
  function rateBuildingCodeEffectivenessGradingCredit(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingCodeEffectivenessGradingCredit", this.IntrinsicType)
    if (_discountsOrSurchargeRatingInfo.BCEGGrade != null){
      var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BUILDING_CODE_COMPLIANCE_GRADING_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_BUILDINGCODECOMPLIANCEGRADECREDIT,
          RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      _hoRatingInfo.BuildingCodeEffectivenessGradingCredit = costData?.ActualTermAmount
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Building Code Effectiveness Grading Credit Rated Successfully", this.IntrinsicType)
  }


  /**
   *  Function to rate the Multi Line discount
   */
  function rateMultiLineDiscount(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateMultiLineDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.MULTI_LINE_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_MULTILINEDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.MultiLineDiscount = costData?.ActualTermAmount
    }
    if(_logger.DebugEnabled)
      _logger.debug("Multi Line Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Affinity discount
   */
  function rateAffinityDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAffinityDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.AFFINITY_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_AFFINITYDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.AffinityDiscount = costData?.ActualTermAmount
    }
    if (_logger.DebugEnabled)
      _logger.debug("Affinity Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Loss assessment Coverage
   */
  function rateLossAssessmentCoverage(dwellingCov: HODW_LossAssessmentCov_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.LossAssessmentLimit > dwellingCov.HOPL_LossAssCovLimit_HOETerm.RuntimeDefault){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Loss Asssessment Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Outboard Motors and Watercraft coverage
   */
  function rateOutboardMotorsAndWatercraftCoverage(lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOutboardMotorsAndWatercraftCoverage", this.IntrinsicType)
    for (item in lineCov.scheduledItem_Ext) {
      var rateRoutineParameterMap = getOutboardMotorsAndWatercraftCovParameterSet(PolicyLine, item, lineCov)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledLineCoverage(lineCov, dateRange, HORateRoutineNames.OUTBOARD_MOTORS_AND_WATERCRAFT_COV_GROUP2_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Outboard Motors and Watercraft Coverage Rated Successfully", this.IntrinsicType)
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

  /*
   *  Function to rate the Town house Or Row house Surcharge
   */
  function rateTownhouseOrRowhouseSurcharge(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateTownhouseOrRowhouseSurcharge", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.TOWNHOUSE_OR_ROWHOUSE_SURCHARGE_RATE_ROUTINE, HOCostType_Ext.TC_TOWNHOUSEORROWHOUSESURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.TownhouseOrRowhouseSurcharge = costData?.ActualTermAmount
    }
    _logger.debug("Townhouse Or Rowhouse Surcharge Rated Successfully", this.IntrinsicType)
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
   * Rate Special Computer coverage
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
   * Rate Other structures - Increased or decreased Limits coverage
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: HODW_Other_Structures_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.OtherStructuresIncreasedLimit !=0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData !=null){
        addCost(costData)
      }
    }
    if (_logger.DebugEnabled)
      _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }
  /**
   *  Rate the Other Structures Rented To Others Coverage
   */
  function rateOtherStructuresRentedToOthersCoverage(dwellingCov: HODW_SpecificOtherStructure_HOE_Ext, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresRentedToOthersCoverage ", this.IntrinsicType)
    var otherStructuresRatingInfo = new HOOtherStructuresRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getOtherStructuresCovParameterSet(PolicyLine, otherStructuresRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_RENTED_TO_OTHERS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    _logger.debug("Other Structures Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }


  /**
   *  Rate the Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage
   */
  function rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov: HODW_FungiCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage ", this.IntrinsicType)
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONI_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null and costData.ActualTermAmount != 0)
        addCost(costData)

    _logger.debug("Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage Rated Successfully", this.IntrinsicType)
  }
  /**
   * Rate the Business property - Increased Limits
   */
  function rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov: HODW_BusinessProperty_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBusinessPropertyIncreasedLimitsCoverage to rate Business Property Increased Limits Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.BusinessPropertyIncreasedLimit > 0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Permitted Incidental Occupancies Coverage
   */
  function ratePermittedIncidentalOccupanciesCoverage(dwellingCov: HODW_PermittedIncOcp_HOE_Ext, dateRange: DateRange) {
  if (_logger.DebugEnabled)
  _logger.debug("Entering " + CLASS_NAME + ":: ratePermittedIncidentalOccupanciesCoverage ", this.IntrinsicType)
  var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
  var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERMITTED_INCIDENTAL_OCCUPANCIES_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
  if (costData != null)
  addCost(costData)

  if (_logger.DebugEnabled)
  _logger.debug("Permitted Incidental Occupancies Coverage Rated Successfully", this.IntrinsicType)
  }


  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }


  /**
   * Function which rates the Personal property replacement cost
   */
  function ratePersonalPropertyReplacementCost(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyReplacementCost", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_REPLACEMENTCOSTONPERSONALPROPERTY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Property Replacement Cost Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
      //TODO Update once typekeys are used
      if (dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.DisplayValue == "25%"){
        var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
        var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
        if (costData != null)
          addCost(costData)
    }
    _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate ACV loss settlement on Roof surfacing for HO3 policy types
   */
  /*function rateACVLossSettlementOnRoofSurfacing(dwellingCov: HODW_LossSettlementWindstorm_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateACVLossSettlementOnRoofSurfacing to rate ACV loss settlement on roof surfacing", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateACVLossSettlementOnRoofSurfacing(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm,_hoRatingInfo)
    if (costData != null)
      addCost(costData)
    _logger.debug("ACV loss settlement on Roof Surfacing Rated Successfully", this.IntrinsicType)
  } */
  /**
   *  Function to rate the Seasonal Or Secondary Residence Surcharge
   */
  function rateSeasonalOrSecondaryResidenceSurcharge(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSeasonalOrSecondaryResidenceSurcharge", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateSeasonalOrSecondaryResidenceSurcharge(dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGE, _discountsOrSurchargeRatingInfo)
    if (costData != null and costData.ActualTermAmount != 0){
      _hoRatingInfo.SeasonalSecondaryResidenceSurcharge = costData.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Seasonal And Secondary Residence Surcharge Rated Successfully", this.IntrinsicType)
  }
  /**
   *  Function to rate the Superior Construction Discount
   */
  function rateSuperiorConstructionDiscount(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateSuperiorConstructionDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.SUPERIOR_CONSTRUCTION_DISCOUNT_ROUTINE, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.SuperiorConstructionDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    _logger.debug("Superior Construction Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Age of Home Discount or Surcharge
   */
  function rateAgeOfHomeDiscount(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAgeOfHomeDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.AgeOfHomeDiscount = costData?.ActualTermAmount
    if (costData != null and costData.ActualTermAmount != 0)
      addCost(costData)
    _logger.debug("Age Of Home Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate Protection Devices Credit
   */
  function rateProtectiveDeviceCredit(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateProtectiveDeviceCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PROTECTIVE_DEVICE_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_PROTECTIVEDEVICECREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.ProtectiveDevicesDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Protection Devices Credit Rated Successfully", this.IntrinsicType)
  }

  function updateLineCostData(lineCov: HomeownersLineCov_HOE, dateRange: DateRange, rateRoutine : String, rateRoutineMap : Map<CalcRoutineParamName, Object>  ){
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, rateRoutine, RateCache, PolicyLine, rateRoutineMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount != 0) {
      addCost(costData)
    }
  }

  private function getHOLineDiscountsOrSurchargesParameterSet(line: PolicyLine, discountOrSurchargeRatingInfo: HOGroup2DiscountsOrSurchargeRatingInfo, state: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> state,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
    }
  }



  /**
   *  Returns the parameter set for the Dwelling coverages
   */
  private function getDwellingCovParameterSet(line: PolicyLine, dwellingRatingInfo: HOGroup2DwellingRatingInfo, stateCode: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

   /*private function getParameterSet(line: PolicyLine, dwellingRatingInfo: HOGroup2DwellingRatingInfo, stateCode: String,discountOrSurchargeRatingInfo: HOGroup2DiscountsOrSurchargeRatingInfo,lineRatingInfo: HOGroup1LineRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo,
        TC_LINERATINGINFO_EXT -> lineRatingInfo

    }

  }
    */
  /**
   * Returns the parameter set with a rating info
   */
  private function getHOParameterSet(line: PolicyLine, stateCode: Jurisdiction, dwellingRatingInfo : HOGroup2DwellingRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  /**
   * Returns the parameter set for Outboard Motor coverages
   */
  private function getOutboardMotorsAndWatercraftCovParameterSet(line: PolicyLine, item: HOscheduleItem_HOE_Ext, lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_OUTBOARDMOTORSANDWATERCRAFTRATINGINFO_Ext -> new HOOutboardMotorsAndWatercraftRatingInfo(item, lineCov)
    }
  }


  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line: PolicyLine, lineRatingInfo: HOGroup2LineRatingInfo, stateCode: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
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
   * Returns the parameter set for the Scheduled Personal Property Cov
   */
  private function getScheduledPersonalPropertyCovParameterSet(line: PolicyLine, item: ScheduledItem_HOE): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_SCHEDULEDPERSONALPROPERTYRATINGINFO_Ext -> new HOScheduledPersonalPropertyRatingInfo(item)
    }
  }

  /**
   * Adjusting the total discount if it exceeds the maximum discount
   */
  function rateMaximumDiscountAdjustment(dateRange: DateRange) {
    var totalDiscountAmount = _hoRatingInfo.SuperiorConstructionDiscount + _hoRatingInfo.ProtectiveDevicesDiscount + _hoRatingInfo.AffinityDiscount + _hoRatingInfo.NamedStormDeductibleCredit +
                              _hoRatingInfo.WindstormMitigationCredit + _hoRatingInfo.MultiLineDiscount + _hoRatingInfo.GatedCommunityDiscount
    if (_hoRatingInfo.AgeOfHomeDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.AgeOfHomeDiscount
    if (_hoRatingInfo.LossHistoryRatingPlan < 0)
      totalDiscountAmount += _hoRatingInfo.LossHistoryRatingPlan
    if (_hoRatingInfo.HigherAllPerilDeductible < 0)
      totalDiscountAmount += _hoRatingInfo.HigherAllPerilDeductible
    if (_hoRatingInfo.BuildingCodeEffectivenessGradingCredit < 0)
      totalDiscountAmount += _hoRatingInfo.BuildingCodeEffectivenessGradingCredit
    _hoRatingInfo.DiscountAdjustment = rateMaximumDiscountAdjustment(dateRange, totalDiscountAmount, _hoRatingInfo.AdjustedBaseClassPremium)
  }

  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedBaseClassPremium + _hoRatingInfo.SuperiorConstructionDiscount + _hoRatingInfo.TownhouseOrRowhouseSurcharge + _hoRatingInfo.ProtectiveDevicesDiscount +
                                     _hoRatingInfo.AffinityDiscount + _hoRatingInfo.AgeOfHomeDiscount + _hoRatingInfo.HigherAllPerilDeductible + _hoRatingInfo.NamedStormDeductibleCredit + _hoRatingInfo.LossHistoryRatingPlan +
                                     _hoRatingInfo.BuildingCodeEffectivenessGradingCredit + _hoRatingInfo.MultiLineDiscount + _hoRatingInfo.GatedCommunityDiscount + _hoRatingInfo.WindstormMitigationCredit +
                                     _hoRatingInfo.DiscountAdjustment
    _dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium

  }
}