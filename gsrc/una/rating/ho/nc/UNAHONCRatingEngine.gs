package una.rating.ho.nc

uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.logging.UnaLoggerCategory
uses java.util.Map
uses una.rating.ho.nc.ratinginfos.HORatingInfo
uses una.rating.ho.nc.ratinginfos.HONCDiscountsOrSurchargeRatingInfo
uses una.rating.ho.nc.ratinginfos.HONCLineRatingInfo
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses una.rating.ho.nc.ratinginfos.HOBasePremiumRatingInfo
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.nc.ratinginfos.HONCDwellingRatingInfo
uses una.rating.ho.common.HOOtherStructuresRatingInfo
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.ho.common.HOSpecialLimitsPersonalPropertyRatingInfo
uses una.rating.ho.common.HOWatercraftLiabilityCovRatingInfo
uses una.rating.ho.common.HOAddResidenceRentedToOthersCovRatingInfo
uses una.rating.ho.common.HOScheduledPersonalPropertyRatingInfo
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 */
class UNAHONCRatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHONCRatingEngine.Type.DisplayName
  private var _hoRatingInfo: HORatingInfo
  private var _discountsOrSurchargeRatingInfo : HONCDiscountsOrSurchargeRatingInfo
  private var _lineRateRoutineParameterMap : Map<CalcRoutineParamName, Object>
  private var _lineRatingInfo : HONCLineRatingInfo
  private var _dwellingRatingInfo : HONCDwellingRatingInfo
  private var _isLPP : boolean


  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _lineRatingInfo = new HONCLineRatingInfo(line)
    _dwellingRatingInfo = new HONCDwellingRatingInfo(line.Dwelling)
    _isLPP = (line.HOPolicyType == HOPolicyType_HOE.TC_LPP_EXT)
  }

  /**
   * Rate the base premium
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterNC(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
    _dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedBaseClassPremium
    _dwellingRatingInfo.KeyPremium = _hoRatingInfo.KeyPremium
    _discountsOrSurchargeRatingInfo = new HONCDiscountsOrSurchargeRatingInfo (PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    _lineRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedBaseClassPremium
    _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
    switch (typeof lineCov) {
      case HOLI_PersonalInjuryAggregate_NC_HOE_Ext:
      case HOLI_PersonalInjury_NC_HOE_Ext:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_AddResidenceRentedtoOthers_HOE:
          rateAddResidenceRentedToOthersCoverage(lineCov, dateRange)
          break
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOSL_OutboardMotorsWatercraft_HOE_Ext:
          rateWatercraftLiabilityCoverage(lineCov, dateRange)
          break
      case DPLI_Personal_Liability_HOE:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.PERSONAL_LIABILITY_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case DPLI_Med_Pay_HOE:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.MEDICAL_PAYMENTS_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
/*      default:
          throw new Exception("Cov rate routine note found")*/
    }
  }


/**
 * Rate the Dwelling level coverages
 */
    override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
      switch (typeof dwellingCov) {
        case DPDW_Personal_Property_HOE:
            ratePersonalPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
            break
        case HODW_FireDepartServiceCharge_HOE_Ext:
            rateFireDepartmentServiceChargeCoverage(dwellingCov, dateRange)
            break
        case HODW_VacancyClause_Ext:
            rateVacancyClauseCoverage(dwellingCov, dateRange)
            break
        case DPDW_OrdinanceCov_HOE:
          if(_dwellingRatingInfo.DwellingFireOrdinanceOrLawLimit > 0.1)
            rateDwellingFireOrdinanceOrLawCoverage(dwellingCov, dateRange)
           break
        case DPDW_Other_Structures_HOE:
            rateDwellingFireOtherStructuresIncreasedLimitsCoverage(dwellingCov, dateRange)
            break
        case HODW_BusinessProperty_HOE_Ext:
            rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
            break
        case HODW_CC_EFT_HOE_Ext:
            rateCreditCardEFTCoverage(dwellingCov, dateRange)
            break
        case HODW_Other_Structures_HOE:
            rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
            break
        case HODW_RefrigeratedPP_HOE_Ext:
          rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange)
          break
        case HODW_SpecialComp_HOE_Ext:
            rateSpecialComputerCoverage(dwellingCov, dateRange)
            break
        case HODW_LimWaterBckSumpDiscOverFlow_NC_HOE_Ext:
            rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
            break
  //      case HODW_ResidenceHeldTrust_NC_HOE_Ext:                              //TODO refactor code because this is taken care of in policy info
          //          rateResidenceHeldInTrust(dwellingCov, dateRange)
  //          break
        case HODW_EquipBreakdown_HOE_Ext:
            rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
            break
        case HODW_SpecificOtherStructure_HOE_Ext:
            rateOtherStructuresRentedToOthersCoverage(dwellingCov, dateRange)
            break
        case HODW_PersonalPropertyOffResidence_HOE:
            ratePersonalPropertyOffResidenceCoverage(dwellingCov, dateRange)
            break
        case HODW_SpecialLimitsPP_HOE_Ext:
            rateSpecialLimitsPersonalPropertyCoverage(dwellingCov, dateRange)
            break
        case HODW_ScheduledProperty_HOE:
            rateScheduledPersonalProperty(dwellingCov, dateRange)
          break
        case HODW_LossAssessmentCov_HOE_Ext:
           if (_dwellingRatingInfo.LossAssessmentLimit > 1000)
              rateLossAssessmentCoverage(dwellingCov, dateRange)
            break
        case HODW_UnitOwnersCovASpecialLimits_HOE_Ext:
          rateUnitOwnerCovASpecialLimitsCoverage(dwellingCov, dateRange)
            break

        case HODW_PermittedIncOcp_HOE_Ext:
            ratePermittedIncidentalOccupanciesCoverage(dwellingCov, dateRange)
            break
        case HODW_Earthquake_HOE:
            if(!_isLPP)
              rateEarthquakeCoverage(dwellingCov, dateRange)
            break
        case HODW_LossAssEQEndorsement_HOE_Ext:
            rateLossAssessmentEarthquakeCoverage(dwellingCov, dateRange)
            break
        //TODO fix the 30000 limit once the limit is defaulted
        case HODW_Dwelling_Cov_HOE:
          if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6 and dwellingCov?.HODW_Dwelling_Limit_HOETerm?.Value > 30000){
             rateUnitOwnersCovAIncreasedLimit(dwellingCov, dateRange)
            }
            break
        case HODW_BuildingAdditions_HOE_Ext:
            if(dwellingCov.HODW_BuildAddInc_HOETerm.LimitDifference > 0){
              rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov, dateRange)
              }
            break
       }
    }

/**
 * Function which rates the discounts and surcharges
 */
    override function rateHOLineCosts(dateRange: DateRange) {
      if(_isLPP){
        if(PolicyLine.Dwelling?.HeatSrcWoodBurningStove)
          rateWoodBurningStove(dateRange)
      }
  }

  /**
   *  Function to rate the Wood Burning Stove Premium
   */
  function rateWoodBurningStove(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateWoodBurningStove", this.IntrinsicType)
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine}
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.WOOD_BURNING_STOVE_RATE_ROUTINE, HOCostType_Ext.TC_WOODBURNINGSTOVE,
                                      RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Wood Burning Stove Premium Rated Successfully", this.IntrinsicType)
  }


   /* Rate the additional residence rented to others coverage
   */
  function rateAddResidenceRentedToOthersCoverage(lineCov: HOLI_AddResidenceRentedtoOthers_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAddResidenceRentedToOthersCoverage", this.IntrinsicType)
    for (item in lineCov.CoveredLocations) {
      var rateRoutineParameterMap = getAddResidenceRentedToOthersCovParameterSet(PolicyLine, item)
      var costData = HOCreateCostDataUtil.createCostDataForAdditionalScheduledLineCoverage(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_RESIDENCE_RENTED_TO_OTHERS_COVERAGE_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Additional Residence - Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }



  function rateEarthquakeCoverage(dwellingCov : HODW_Earthquake_HOE, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEarthquakeCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var rateRoutineName = HORateRoutineNames.EQ_COVERAGE_RATE_ROUTINE
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, rateRoutineName, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Earthquake Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the loss assessment earthquake coverage
  */
  function rateLossAssessmentEarthquakeCoverage(dwellingCov : HODW_LossAssEQEndorsement_HOE_Ext, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentEarthquakeCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_EQ_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Loss Assessment Earthquake Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Affinity discount
   */
  function rateAffinityDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAffinityDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHODiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
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
    * Rate Unit Owners Cov A Special Limits Coverage
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
   * Rate Unit-Owners Coverage A Increased Limits
   */
  function rateUnitOwnersCovAIncreasedLimit(dwellingCov : HODW_Dwelling_Cov_HOE, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersCovAIncreasedLimit ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.UNIT_OWNERS_COVA_INCREASED_LIMIT_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Unit Owners CovA Increased Limit Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the watercraft liability coverage for Texas
   */
  function rateWatercraftLiabilityCoverage(lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOutboardMotorsAndWatercraftCoverage", this.IntrinsicType)
    for (item in lineCov.scheduledItem_Ext) {
      var rateRoutineParameterMap = getWatercraftLiabilityCovParameterSet(item, lineCov)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledLineCoverage(lineCov, dateRange, HORateRoutineNames.WATERCRAFT_LIABILITY_COVERAGE_RATE_ROUTINE, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Outboard Motors and Watercraft Coverage Rated Successfully", this.IntrinsicType)
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
   *  Rate the Personal Property Off Residence
   */
  function ratePersonalPropertyOffResidenceCoverage(dwellingCov: HODW_PersonalPropertyOffResidence_HOE, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyOffResidenceCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_OFF_RESIDENCE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    _logger.debug("ratePersonalPropertyOffResidenceCoverage Rated Successfully", this.IntrinsicType)
  }


  /**
   *  Rate the Building Additions And Alterations Increased Limits Coverage
   */
  function rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov: HODW_BuildingAdditions_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage ", this.IntrinsicType)
    _dwellingRatingInfo.KeyPremium = _hoRatingInfo.KeyPremium
    var rateRoutineParameterMap = getDwellingCovParameterSet (PolicyLine,_dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUILDING_ADDITIONS_AND_ALTERATIONS_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Building Additions And Alterations Increased Limits Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate Equipment breakdown coverage
   */
  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, _discountsOrSurchargeRatingInfo)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }


  /**
   * Rate Water backup Sump Overflow coverage
   */
  //TODO refactor code because this is taken care of in policy info
//  function rateResidenceHeldInTrust(dwellingCov: HODW_ResidenceHeldTrust_NC_HOE_Ext, dateRange: DateRange) {
//    _logger.debug("Entering " + CLASS_NAME + ":: rateResidenceHeldInTrust to rate Residence Held in Trust Coverage", this.IntrinsicType)
//    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
//    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.RESIDENCE_HELD_IN_TRUST_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
//    if (costData != null)
//      addCost(costData)
//    _logger.debug
//  }

  /**("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate Water backup Sump Overflow coverage
   */
  function rateWaterBackupSumpOverflowCoverage(dwellingCov: HODW_LimWaterBckSumpDiscOverFlow_NC_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateWaterBackupSumpOverflowCoverage to rate Water Backup Sump Overflow Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.WATER_BACKUP_SUMP_OVERFLOW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate Other structures - Increased or decreased Limits coverage
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: HODW_Other_Structures_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var otherStructuresRatingInfo = new HOOtherStructuresRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getOtherStructuresCovParameterSet(PolicyLine, otherStructuresRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Credit Card, EFT, Access Device, Forgery and Counterfeit Money
   */
  function rateCreditCardEFTCoverage(dwellingCov: HODW_CC_EFT_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateCreditCardEFTCoverage to rate the Credit Card, EFT, Access Device, Forgery and Counterfeit Money", this.IntrinsicType)
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.CC_EFT_ACCESSDEVICE_FORGERY_AND_COUNTERFEIT_MONEY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }



  /**
   * Rate the Business property - Increased Limits
   */
  function rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov: HODW_BusinessProperty_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBusinessPropertyIncreasedLimitsCoverage to rate Business Property Increased Limits Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.BusinessPropertyIncreasedLimit > 0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased Limits
   */
  function ratePersonalPropertyIncreasedLimitsCoverage(dwellingCov: DPDW_Personal_Property_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyIncreasedLimitsCoverage to rate Personal Property Increased Limits Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Personal Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Other Structures - Increased Limits
   */
  function rateDwellingFireOtherStructuresIncreasedLimitsCoverage(dwellingCov: DPDW_Other_Structures_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedLimitsCoverage to rate Other Structures Increased Limits Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.DWELLING_FIRE_OTHER_STRUCTURES_INCREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Other Structures Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Fire Department Service Charge Coverage
   */
  function rateFireDepartmentServiceChargeCoverage(dwellingCov: HODW_FireDepartServiceCharge_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateFireDepartmentServiceChargeCoverage to rate Fire Department Service Charge Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.FIRE_DEPARTMENT_SERVICE_CHARGE_COV_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Fire Department Service Charge Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Vacancy Clause Coverage coverage
   */
  function rateVacancyClauseCoverage(dwellingCov: HODW_VacancyClause_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateVacancyClauseCoverage to rate Vacancy Clause Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.VACANY_CLAUSE_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Vacancy Clause Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Dwelling Fire Ordinance Or Law Coverage
   */
  function rateDwellingFireOrdinanceOrLawCoverage(dwellingCov: DPDW_OrdinanceCov_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateDwellingFireOrdinanceOrLawCoverage to rate Dwelling Fire Ordinance Or Law Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Dwelling Fire Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Returns the parameter set for the Dwelling coverages
   */
  private function getDwellingCovParameterSet(line: PolicyLine, dwellingRatingInfo: HONCDwellingRatingInfo, stateCode: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
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
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line: PolicyLine, lineRatingInfo: HONCLineRatingInfo, stateCode: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

  function updateLineCostData(lineCov: HomeownersLineCov_HOE, dateRange: DateRange, rateRoutine : String, rateRoutineMap : Map<CalcRoutineParamName, Object>  ){
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, rateRoutine, RateCache, PolicyLine, rateRoutineMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
  }
  /**
   * Created parameter set to execute the base premium routines
   */
  private function NCRBParameterSet(line: PolicyLine, basePremiumRatingInfo: HOBasePremiumRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> basePremiumRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Additional Residence Rented To Others
   */
  private function getAddResidenceRentedToOthersCovParameterSet(line: PolicyLine, item: CoveredLocation_HOE): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_ADDRESIDENCERENTEDTOOTHERSRATINGINFO_EXT -> new HOAddResidenceRentedToOthersCovRatingInfo(item)
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
   * Returns the parameter set for the Special Limits Personal Property Cov
   */
  private function getSpecialLimitsPersonalPropertyCovParameterSet(line : PolicyLine, dwellingCov : HODW_SpecialLimitsPP_HOE_Ext) : Map<CalcRoutineParamName, Object>{
    return {
        TC_POLICYLINE -> line,
        TC_SPECIALLIMITSPERSONALPROPERTYRATINGINFO_Ext -> new HOSpecialLimitsPersonalPropertyRatingInfo(dwellingCov)
    }
  }

  /**
   * Returns the parameter set for the Dwelling level coverages
   */
  private function getWatercraftLiabilityCovParameterSet(item: HOscheduleItem_HOE_Ext, lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_OUTBOARDMOTORSANDWATERCRAFTRATINGINFO_Ext -> new HOWatercraftLiabilityCovRatingInfo(item, lineCov)
    }
  }

  private function getHODiscountsOrSurchargesParameterSet(line: PolicyLine, discountOrSurchargeRatingInfo: HONCDiscountsOrSurchargeRatingInfo, state: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> state,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
    }
  }

  /**
   * Returns the parameter set with a rating info
   */
  private function getHOParameterSet(line: PolicyLine, stateCode: Jurisdiction, dwellingRatingInfo: HONCDwellingRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }
}