package una.rating.ho.group1

uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.common.HOSpecialLimitsPersonalPropertyRatingInfo
uses una.rating.ho.group1.ratinginfos.HOGroup1DiscountsOrSurchargeRatingInfo
uses una.rating.ho.group1.ratinginfos.HOGroup1DwellingRatingInfo
uses una.rating.ho.group1.ratinginfos.HOGroup1LineLevelRatingInfo
uses una.rating.ho.group1.ratinginfos.HOGroup1LineRatingInfo
uses una.rating.ho.group1.ratinginfos.HOOutboardMotorsAndWatercraftRatingInfo
uses una.rating.ho.group1.ratinginfos.HOAddResidenceRentedToOthersCovRatingInfo
uses una.rating.ho.group1.ratinginfos.HORatingInfo
uses una.rating.ho.group1.ratinginfos.HOWCPrivateResidenceEmployeeRatingInfo
uses una.rating.util.HOCreateCostDataUtil

uses java.util.Map
uses una.rating.ho.common.HOScheduledPersonalPropertyRatingInfo
uses gw.rating.CostData
uses java.lang.Integer

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
  private var _discountsOrSurchargeRatingInfo: HOGroup1DiscountsOrSurchargeRatingInfo
  private var _lineRatingInfo: HOGroup1LineRatingInfo
  private var _lineRateRoutineParameterMap: Map<CalcRoutineParamName, Object>
  private var _hasExecutiveCoverage: boolean as HasExecutiveCoverage
  private var _hasEarthquakeLimitedCoverage: boolean as HasEarthquakeLimitedCoverage
  private var _hasEarthquakeComprehensiveCoverage: boolean as HasEarthquakeComprehensiveCoverage
  private var _hasEarthquakeCoverage: boolean as HasEarthquakeCoverage
  private var _hasSeasonalOrSecondaryResidenceSurcharge: boolean as HasSeasonalOrSecondaryResidenceSurcharge = false
  private var _dwellingRatingInfo : HOGroup1DwellingRatingInfo

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _lineRatingInfo = new HOGroup1LineRatingInfo(line)
    _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState.Code)
    _hasExecutiveCoverage = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HasHODW_ExecutiveCov_HOE_ExtTerm ? line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_ExecutiveCov_HOE_ExtTerm?.Value : false
    _hasEarthquakeLimitedCoverage = line?.Dwelling?.HODW_Limited_Earthquake_CA_HOEExists
    _hasEarthquakeComprehensiveCoverage = line?.Dwelling?.HODW_Comp_Earthquake_CA_HOE_ExtExists
    _hasEarthquakeCoverage = line?.Dwelling?.HODW_Earthquake_HOEExists


    if(line?.Dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC){
      if(PolicyLine.BaseState == Jurisdiction.TC_AZ){
        if(line?.Dwelling?.DwellingProtectionDetails?.GatedCommunity or (line?.Dwelling?.DwellingProtectionDetails?.FireAlarmReportCntlStn and
            line?.Dwelling?.DwellingProtectionDetails?.BurglarAlarmReportCntlStn)){
           _hasSeasonalOrSecondaryResidenceSurcharge = true
        }
      }else{
          _hasSeasonalOrSecondaryResidenceSurcharge = true
      }
    }



    _dwellingRatingInfo = new HOGroup1DwellingRatingInfo(line.Dwelling)

  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterGroup1(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
    _dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOLI_Personal_Liability_HOE:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.INCREASED_SECTION_II_LIMITS_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_AnimalLiabilityCov_HOE_Ext:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_FungiCov_HOE:
          if(PolicyLine.BaseState != Jurisdiction.TC_CA)
            updateLineCostData(lineCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONII_GROUP1_COV_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_PersonalInjury_HOE:
          if (!HasExecutiveCoverage)
            updateLineCostData(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOSL_OutboardMotorsWatercraft_HOE_Ext:
          rateOutboardMotorsAndWatercraftCoverage(lineCov, dateRange)
          break
      case HOLI_AddResidenceRentedtoOthers_HOE:
          rateAddResidenceRentedToOthersCoverage(lineCov, dateRange)
          break
      case HOLI_WC_PrivateResidenceEmployee_HOE_Ext:
          rateWCPrivateResidenceEmployeeCoverage(lineCov, dateRange)
          break
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
          rateUnitOwnersRentalToOthers(lineCov, dateRange)
          break
    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    switch (typeof dwellingCov) {
      case HODW_Dwelling_Cov_HOE:
          if (HasExecutiveCoverage){
            rateExecutiveCoverage(dwellingCov, dateRange)
          }
          if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6){
            rateUnitOwnersCovAIncreasedLimit(dwellingCov, dateRange)
          }
          break
      case HODW_EquipBreakdown_HOE_Ext:
          rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
          break
      case HODW_Other_Structures_HOE:
          rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
          break
      case HODW_IdentityTheftExpenseCov_HOE_Ext:
          rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
          break
      case HODW_RefrigeratedPP_HOE_Ext:
          if (!HasExecutiveCoverage)
            rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecialComp_HOE_Ext:
          rateSpecialComputerCoverage(dwellingCov, dateRange)
          break
      case HODW_WaterBackUpSumpOverflow_HOE_Ext:
          if (!HasExecutiveCoverage)
            rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecificAddAmt_HOE_Ext:
          if (!HasExecutiveCoverage)
            rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange)
          break
      case HODW_Personal_Property_HOE:
          if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3)
            rateIncreasedPersonalProperty(dwellingCov, dateRange)
          break
      case HODW_OrdinanceCov_HOE:
          if (!HasExecutiveCoverage)
            rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
          break
      case HODW_BusinessProperty_HOE_Ext:
          rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
          break
      case HODW_ScheduledProperty_HOE:
          rateScheduledPersonalProperty(dwellingCov, dateRange)
          break
      case HODW_FungiCov_HOE:
          if(PolicyLine.BaseState != Jurisdiction.TC_CA)
            rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov, dateRange)
          break
      case HODW_SpecialPersonalProperty_HOE_Ext:
          rateSpecialPersonalPropertyCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecialLimitsPP_HOE_Ext:
          if (!HasExecutiveCoverage)
            rateSpecialLimitsPersonalPropertyCoverage(dwellingCov, dateRange)
          break
      case HODW_LossAssessmentCov_HOE_Ext:
          if(!(PolicyLine.BaseState == Jurisdiction.TC_AZ and PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO4))
            rateLossAssessmentCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecificOtherStructure_HOE_Ext:
          rateOtherStructuresRentedToOthersCoverage(dwellingCov, dateRange)
          break
      case HODW_PermittedIncOcp_HOE_Ext:
          ratePermittedIncidentalOccupanciesCoverage(dwellingCov, dateRange)
          break
      case HODW_BuildingAdditions_HOE_Ext:
          rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov, dateRange)
          break
      case HODW_Limited_Earthquake_CA_HOE:
          if (HasEarthquakeLimitedCoverage and PolicyLine.BaseState == typekey.Jurisdiction.TC_CA and
             (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO4 or PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6
             or PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3)){
            rateEarthquakeLimitedCovCA(dwellingCov, dateRange)
          }
          break
      case HODW_Comp_Earthquake_CA_HOE_Ext:
          if (HasEarthquakeComprehensiveCoverage and PolicyLine.BaseState == typekey.Jurisdiction.TC_CA
              and PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6 or PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
            rateEarthquakeComprehensiveCovCA(dwellingCov, dateRange)
          }
          break
      case HODW_Earthquake_HOE:
          if (HasEarthquakeCoverage and (PolicyLine.BaseState == typekey.Jurisdiction.TC_NV or PolicyLine.BaseState == typekey.Jurisdiction.TC_AZ) and
              (_dwellingRatingInfo.BCEGGrade != typekey.BCEGGrade_Ext.TC_99 and _dwellingRatingInfo.BCEGGrade != typekey.BCEGGrade_Ext.TC_98)
              and (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 or PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO4 or PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6)){
            rateEarthquakeCoverage(dwellingCov, dateRange)
          }
          break
      case HODW_UnitOwnersCovASpecialLimits_HOE_Ext:
          if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6){
              rateUnitOwnersCovASpecialLimitsCoverage(dwellingCov, dateRange)
          }
          break
      case HODW_Vandalism_Malicious_Mischief_HOE_Ext:
          rateVMMCoverage(dwellingCov, dateRange)
          break
    }
  }

  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
    var dwelling = PolicyLine.Dwelling
    _discountsOrSurchargeRatingInfo = new HOGroup1DiscountsOrSurchargeRatingInfo(PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
    if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 or
        (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6 and PolicyLine.BaseState == typekey.Jurisdiction.TC_NV)){
      rateAgeOfHomeDiscount(dateRange)
    }
    if (dwelling.HODW_DifferenceConditions_HOE_ExtExists){
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6 and PolicyLine.BaseState == typekey.Jurisdiction.TC_CA))
        rateDifferenceInConditions(dwelling.HODW_DifferenceConditions_HOE_Ext, dateRange)
    }
    if (HasSeasonalOrSecondaryResidenceSurcharge){
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        rateSeasonalOrSecondaryResidenceSurcharge(dateRange)
    }
    }
    var constructionType = dwelling.OverrideConstructionType_Ext? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
    if (constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT and
        (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6)) {
      rateSuperiorConstructionDiscount(dateRange)
    }

    var dwellingRoofType = dwelling.OverrideRoofType_Ext? dwelling.RoofingMaterialOverridden_Ext : dwelling.RoofType

    if ((dwellingRoofType == typekey.RoofType.TC_TILECONCRETE || dwellingRoofType== typekey.RoofType.TC_TILE_CONCRETE_EXT)
        and PolicyLine.BaseState != typekey.Jurisdiction.TC_NV){
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3)
        rateConcreteTileRoofDiscount(dateRange)
    }

    if (PolicyLine.BaseState == Jurisdiction.TC_AZ){
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6)
        ratePrivateFireCompanyDiscount(dateRange)
    }

    if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
        _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6 ||
        (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 and PolicyLine.BaseState == Jurisdiction.TC_CA)){
      if (PolicyLine.Branch.QualifiesAffinityDisc_Ext) {
        rateAffinityDiscount(dateRange)
      }
    }
    if (PolicyLine.BaseState != Jurisdiction.TC_CA and _discountsOrSurchargeRatingInfo.BCEGFactor != "99" and _discountsOrSurchargeRatingInfo.BCEGFactor != "98"){
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6 and (PolicyLine.BaseState == Jurisdiction.TC_AZ or PolicyLine.BaseState == Jurisdiction.TC_NV)))
        rateBuildingCodeEffectivenessGradingCredit(dateRange)
    }

    if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
        _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6)
      rateHigherAllPerilDeductible(dateRange)

    if ((_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
        _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6) and (PolicyLine.BaseState == Jurisdiction.TC_AZ or PolicyLine.BaseState == Jurisdiction.TC_CA)) {
      rateLossHistoryCredit(dateRange)
    }

    if (dwelling.DwellingProtectionDetails.GatedCommunity){
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6)
        rateGatedCommunityDiscount(dateRange)
    }

    if (PolicyLine.BaseState == Jurisdiction.TC_CA and dwelling.Occupancy == DwellingOccupancyType_HOE.TC_VACANT)
      if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6)
        rateVacantDwellings(dateRange)

    if(_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 and dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
      _discountsOrSurchargeRatingInfo.NumOfUnitsWithinFireDivision = dwelling?.NumUnitsFireDivision_Ext.Numeric? dwelling?.NumUnitsFireDivision_Ext.toInt() : 0
      rateTownhouseOrRowhouseSurcharge(dateRange)
    }

    if(PolicyLine.BaseState == Jurisdiction.TC_CA){
      var firelineAdjustedHazardScore = dwelling?.HOLocation?.OverrideFirelineAdjHaz_Ext ? dwelling?.HOLocation?.FirelineAdjHazOverridden_Ext : dwelling?.HOLocation?.FirelineAdjHaz_Ext
      if(firelineAdjustedHazardScore != null)
        if(Integer.parseInt(firelineAdjustedHazardScore?.Code) > 6 )
          rateBrushHazardSurcharge(dateRange)
    }

    if(PolicyLine.BaseState == Jurisdiction.TC_NV or PolicyLine.BaseState == Jurisdiction.TC_AZ or
        PolicyLine.BaseState == Jurisdiction.TC_CA){
      rateProtectiveDeviceCredit(dateRange)
    }

    if(PolicyLine.MultiPolicyDiscount_Ext){
      rateMultiLineDiscount(dateRange)
    }

    rateMaximumDiscountAdjustment(dateRange)

    //update the total base premium with the discounts and surcharges
    updateTotalBasePremium()

    if (_discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO3 || _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
        _discountsOrSurchargeRatingInfo.PolicyType == typekey.HOPolicyType_HOE.TC_HO6){
      if (dwelling?.HODW_Personal_Property_HOEExists and (!HasExecutiveCoverage)){
        if (dwelling?.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm?.Value == tc_PersProp_ReplCost){
          ratePersonalPropertyReplacementCost(dateRange)
        }
      }
    }
    if(PolicyLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 and PolicyLine.HODW_CashSettlementWindOrHailRoofSurfacing_HOEExists)
      rateACVLossSettlementOnRoofSurfacing(dateRange)
  }
  /**
   * Rate VMM coverage
   */
  function rateVMMCoverage(dwellingCov: HODW_Vandalism_Malicious_Mischief_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateVMMCoverage to rate VMM Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.HO_VMM_DWELLING_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm, HOCostType_Ext.TC_VANDALISMMALICIOUSMISCHIEFLIMITATION)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("VMM Coverage Rated Successfully", this.IntrinsicType)
  }
  /**
   *  Function to rate the Deductible Factor
   */
  function rateHigherAllPerilDeductible(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateHigherAllPerilDeductible", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HIGHER_ALL_PERIL_DEDUCTIBLE_RATE_ROUTINE, HOCostType_Ext.TC_HIGHERALLPERILDEDUCTIBLE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.HigherAllPerilDeductible = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
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

  /**
   *  Function to rate the Superior Construction Discount
   */
  function rateSuperiorConstructionDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSuperiorConstructionDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.SUPERIOR_CONSTRUCTION_DISCOUNT_ROUTINE, HOCostType_Ext.TC_SUPERIORCONSTRUCTIONDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.SuperiorConstructionDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Superior Construction Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Gated Community discount
   */
  function rateGatedCommunityDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateGatedCommunityDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.GATED_COMMUNITY_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_GATEDCOMMUNITYDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.GatedCommunityDiscount = costData?.ActualTermAmount
      addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Gated Community Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Multi Line discount
   */
  function rateMultiLineDiscount(dateRange: DateRange){
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateMultiLineDiscount", this.IntrinsicType)
    var costMap = new java.util.HashMap<typekey.TypeofPolicy_Ext, CostData>()
    var policyTypes = PolicyLine.Branch.MultiPolicyDiscountPolicies_Ext*.PolicyType.toSet()
    if(policyTypes.contains(typekey.TypeofPolicy_Ext.TC_HOMEOWNER) and policyTypes.contains(typekey.TypeofPolicy_Ext.TC_DWELLINGFIRE) ){
      policyTypes.remove(typekey.TypeofPolicy_Ext.TC_DWELLINGFIRE)
    }

    policyTypes.each( \ elt -> {
      _discountsOrSurchargeRatingInfo.TypeOfPolicyForMultiLine = elt
      var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.MULTI_LINE_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_MULTILINEDISCOUNT,
          RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      costMap.put(elt, costData)
    })

    if(costMap.containsKey(typekey.TypeofPolicy_Ext.TC_AUTO)){
      addCost(costMap.get(typekey.TypeofPolicy_Ext.TC_AUTO))
      _hoRatingInfo.MultiLineDiscount = costMap.get(typekey.TypeofPolicy_Ext.TC_AUTO).ActualTermAmount
    }else{
      var actualCost = costMap.values().first()
      actualCost.ActualTermAmount = costMap.values()*.ActualTermAmount.sum()
      addCost(actualCost)
      _hoRatingInfo.MultiLineDiscount = actualCost?.ActualTermAmount
    }

    if(_logger.DebugEnabled)
      _logger.debug("Multi Line Discount Rated Successfully", this.IntrinsicType)

  }

  /**
   *  Function to rate the Concrete Tile Roof Discount
   */
  function rateConcreteTileRoofDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateConcreteTileRoofDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.CONCRETE_TILE_ROOF_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_CONCRETETILEROOFDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.ConcreteTileRoofDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Concrete Tile Roof Discount Rated Successfully", this.IntrinsicType)
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
   *  Function to rate the Private Fire Company Discount
   */
  function ratePrivateFireCompanyDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePrivateFireCompanyDiscount", this.IntrinsicType)
    if (_discountsOrSurchargeRatingInfo.IsPrivateFireCompanyDiscountApplicable){
      var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PRIVATE_FIRE_COMPANY_DISCOUNT_AZ_RATE_ROUTINE, HOCostType_Ext.TC_PRIVATEFIRECOMPANYDISCOUNT,
          RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      _hoRatingInfo.PrivateFireCompanyDiscount = costData?.ActualTermAmount
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Private Fire Company Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Building Code Effectiveness Grading Credit
   */
  function rateBuildingCodeEffectivenessGradingCredit(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingCodeEffectivenessGradingCredit", this.IntrinsicType)
    if (_discountsOrSurchargeRatingInfo.BCEGFactor != null){
      var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BUILDING_CODE_EFFECTIVENESS_GRADING_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_BUILDINGCODECOMPLIANCEGRADECREDIT,
          RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      _hoRatingInfo.BuildingCodeEffectivenessGradingCredit = costData?.ActualTermAmount
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Building Code Effectiveness Grading Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Vacant Dwellings
   */
  function rateVacantDwellings(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateVacantDwellings", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.VACANT_DWELLINGS_RATE_ROUTINE, HOCostType_Ext.TC_VACANCYSURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.VacancySurcharge = costData?.ActualTermAmount
    }
    if (_logger.DebugEnabled)
      _logger.debug("Vacant Dwellings Rated Successfully", this.IntrinsicType)
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

  /*
   *  Function to rate the Brush Hazard Surcharge
   */
  function rateBrushHazardSurcharge(dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateBrushHazardSurcharge", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BRUSH_HAZARD_SURCHARGE_RATE_ROUTINE, HOCostType_Ext.TC_BRUSHHAZARDSURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.BrushHazardSurcharge = costData?.ActualTermAmount
    }
    _logger.debug("Brush Hazard Surcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Age of Home Discount or Surcharge
   */
  function rateAgeOfHomeDiscount(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAgeOfHomeDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.AgeOfHomeDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Age Of Home Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   * Function which rates the Personal property replacement cost
   */
  function ratePersonalPropertyReplacementCost(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyReplacementCost", this.IntrinsicType)
    var costDataForIncreasedPersonalProperty : CostData = null
    if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
      var rateRoutineParameter = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      costDataForIncreasedPersonalProperty = HOCreateCostDataUtil.createCostDataForDwellingCoverage(PolicyLine.Dwelling?.HODW_Dwelling_Cov_HOE, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameter, Executor, this.NumDaysInCoverageRatedTerm)
    }
    var lineLevelRatingInfo = new HOGroup1LineLevelRatingInfo(PolicyLine)
    lineLevelRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
    lineLevelRatingInfo.AdjustedBaseClassPremium = _hoRatingInfo.AdjustedBaseClassPremium
    lineLevelRatingInfo.IncreasedPersonalPropertyPremium = costDataForIncreasedPersonalProperty?.ActualTermAmount
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, lineLevelRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_REPLACEMENTCOSTONPERSONALPROPERTY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Personal Property Replacement Cost Rated Successfully", this.IntrinsicType)
  }

  /**
   * Function which rates the Difference in conditions
   */
  function rateDifferenceInConditions(dwellingCov: HODW_DifferenceConditions_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateDifferenceInConditions", this.IntrinsicType)
    var lineLevelRatingInfo = new HOGroup1LineLevelRatingInfo(PolicyLine)
    lineLevelRatingInfo.TotalBasePremium = _hoRatingInfo.AdjustedBaseClassPremium
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, lineLevelRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.DIFFERENCE_IN_CONDITIONS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.DifferenceInConditions = costData.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Difference in Conditions Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Seasonal Or Secondary Residence Surcharge
   */
  function rateSeasonalOrSecondaryResidenceSurcharge(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSeasonalOrSecondaryResidenceSurcharge", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateSeasonalOrSecondaryResidenceSurcharge(dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGE, _discountsOrSurchargeRatingInfo)
    if (costData != null){
      _hoRatingInfo.SeasonalSecondaryResidenceSurcharge = costData.ActualTermAmount
      addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Seasonal And Secondary Residence Surcharge Rated Successfully", this.IntrinsicType)
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
   * Rate Other structures - Increased or decreased Limits coverage
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: HODW_Other_Structures_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.PolicyType == HOPolicyType_HOE.TC_HO4) {
      _dwellingRatingInfo.BuildingAdditionsAndAlterationsLimit = dwellingCov.Dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
    }
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateEarthquakeLimitedCovCA(dwellingCov : HODW_Limited_Earthquake_CA_HOE, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEarthquakeLimitedCovCA ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.EQ_LIMITED_COV_CA_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Earthquake Limited Coverage CA Rated Successfully", this.IntrinsicType)
  }

  function rateEarthquakeComprehensiveCovCA(dwellingCov : HODW_Comp_Earthquake_CA_HOE_Ext, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEarthquakeComprehensiveCovCA ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.EQ_COMPREHENSIVE_COV_CA_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Earthquake Comprehensive Coverage CA Rated Successfully", this.IntrinsicType)
  }

  function rateEarthquakeCoverage(dwellingCov : HODW_Earthquake_HOE, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEarthquakeCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var rateRoutineName = ""
    if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
        rateRoutineName = HORateRoutineNames.EQ_COVERAGE_RATE_ROUTINE_HO3
    } else if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO4){
      rateRoutineName = HORateRoutineNames.EQ_COVERAGE_RATE_ROUTINE_HO4
    } else if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6){
      rateRoutineName = HORateRoutineNames.EQ_COVERAGE_RATE_ROUTINE_HO6
    }
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, rateRoutineName, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Earthquake Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateUnitOwnersCovASpecialLimitsCoverage(dwellingCov: HODW_UnitOwnersCovASpecialLimits_HOE_Ext, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersCovASpecialLimitsCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.UNIT_OWNERS_COVA_SPECIAL_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Unit Owners CovA Special Limits Coverage Rated Successfully", this.IntrinsicType)
  }

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
   *  Rate the Other Structures Rented To Others Coverage
   */
  function rateOtherStructuresRentedToOthersCoverage(dwellingCov: HODW_SpecificOtherStructure_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresRentedToOthersCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_RENTED_TO_OTHERS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Other Structures Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Permitted Incidental Occupancies Coverage
   */
  function ratePermittedIncidentalOccupanciesCoverage(dwellingCov: HODW_PermittedIncOcp_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePermittedIncidentalOccupanciesCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERMITTED_INCIDENTAL_OCCUPANCIES_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Permitted Incidental Occupancies Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Building Additions And Alterations Increased Limits Coverage
   */
  function rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov: HODW_BuildingAdditions_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUILDING_ADDITIONS_AND_ALTERATIONS_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Building Additions And Alterations Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Executive Coverage
   */
  function rateExecutiveCoverage(dwellingCov: HODW_Dwelling_Cov_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateExecutiveCoverage to rate Executive Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCommonRatingInfoParameterSet(PolicyLine, _hoRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.EXECUTIVE_COVERAGE_RATE_ROUTINE, HOCostType_Ext.TC_EXECUTIVECOVERAGE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Executive Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage
   */
  function rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage(dwellingCov: HODW_FungiCov_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateLimitedFungiWetOrDryRotOrBacteriaSectionICoverage ", this.IntrinsicType)
    if (!_dwellingRatingInfo.IsLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LIMITED_FUNGI_WET_OR_DRY_ROT_OR_BACTERIA_SECTIONI_GROUP1_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Limited Fungi, Wet Or Dry Rot Or Bacteria Section I coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Special Personal Property
   */
  function rateSpecialPersonalPropertyCoverage(dwellingCov: HODW_SpecialPersonalProperty_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialPersonalPropertyCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_PERSONAL_PROPERTY_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Special Personal Property Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Business property - Increased Limits
   */
  function rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov: HODW_BusinessProperty_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBusinessPropertyIncreasedLimitsCoverage to rate Business Property Increased Limits Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.BusinessPropertyIncreasedLimit > 0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Scheduled Personal property
   */
  function rateScheduledPersonalProperty(dwellingCov: HODW_ScheduledProperty_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateScheduledPersonalProperty to rate Scheduled Personal Property Coverage", this.IntrinsicType)
    for (item in dwellingCov.ScheduledItems) {
      var rateRoutineParameterMap = getScheduledPersonalPropertyCovParameterSet(PolicyLine, item)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SCHEDULED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Scheduled Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Special Limits Personal property coverage
   */
  function rateSpecialLimitsPersonalPropertyCoverage(dwellingCov: HODW_SpecialLimitsPP_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialLimitsPersonalPropertyCoverage to rate Special Limits Personal Property Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getSpecialLimitsPersonalPropertyCovParameterSet(PolicyLine, dwellingCov)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_LIMITS_PERSONAL_PROPERTY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Special Limits Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Outboard Motors and Watercraft coverage
   */
  function rateOutboardMotorsAndWatercraftCoverage(lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOutboardMotorsAndWatercraftCoverage", this.IntrinsicType)
    for (item in lineCov.scheduledItem_Ext) {
      var rateRoutineParameterMap = getOutboardMotorsAndWatercraftCovParameterSet(PolicyLine, item, lineCov)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledLineCoverage(lineCov, dateRange, HORateRoutineNames.OUTBOARD_MOTORS_AND_WATERCRAFT_COV_GROUP1_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Outboard Motors and Watercraft Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Additional Residence - Rented To Others Coverage
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

  /**
   * Rate ACV loss settlement on Roof surfacing for HO3 policy types
   */
  function rateACVLossSettlementOnRoofSurfacing(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateACVLossSettlementOnRoofSurfacing to rate ACV loss settlement on roof surfacing", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateACVLossSettlementOnRoofSurfacing(dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, _hoRatingInfo, HOCostType_Ext.TC_ACVLOSSSETTLEMENTWINDORHAILLOSSESTOROOFSURFACING)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("ACV loss settlement on Roof Surfacing Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Refrigerated Personal Property coverage
   */
  function rateRefrigeratedPersonalPropertyCoverage(dwellingCov: HODW_RefrigeratedPP_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateRefrigeratedPersonalPropertyCoverage to rate Refrigerated Personal Property Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Refrigerated Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Special Computer coverage
   */
  function rateSpecialComputerCoverage(dwellingCov: HODW_SpecialComp_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialComputerCoverage to rate Special Computer Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_COMPUTER_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Special Computer Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Water backup Sump Overflow coverage
   */
  function rateWaterBackupSumpOverflowCoverage(dwellingCov: HODW_WaterBackUpSumpOverflow_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateWaterBackupSumpOverflowCoverage to rate Water Backup Sump Overflow Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.WATER_BACKUP_SUMP_OVERFLOW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateIdentityTheftExpenseCoverage to rate Identity Theft Expense Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateIdentityTheftExpenseCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Identity Theft Expense Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Workers compensation - Private Residence Employee coverage
   */
  function rateWCPrivateResidenceEmployeeCoverage(lineCov: HOLI_WC_PrivateResidenceEmployee_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateWCPrivateResidenceEmployeeCoverage to rate Workers compensation - Private Residence Employee Coverage", this.IntrinsicType)
    var wcPrivateResidenceEmployeeRatingInfo = new HOWCPrivateResidenceEmployeeRatingInfo(lineCov)
    var rateRoutineParameterMap = getWCPrivateResidenceEmployeeCovParameterSet(PolicyLine, wcPrivateResidenceEmployeeRatingInfo)
    updateLineCostData(lineCov, dateRange, HORateRoutineNames.WC_PRIVATE_RESIDENCE_EMPLOYEES_CA_RATE_ROUTINE, rateRoutineParameterMap)
    if (_logger.DebugEnabled)
      _logger.debug("Workers compensation - Private Residence Employee Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the unit owners - Rental to other coverage
   */
  function rateUnitOwnersRentalToOthers(lineCov: HOLI_UnitOwnersRentedtoOthers_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersRentalToOthers to rate Unit Owners Rental To Others Coverage", this.IntrinsicType)
    _lineRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
    //need to update with the total base premium
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object> = {
      TC_POLICYLINE -> PolicyLine,
      TC_STATE -> PolicyLine.BaseState.Code,
      TC_BASEPREMIUM -> _hoRatingInfo.TotalBasePremium,
      typekey.CalcRoutineParamName.TC_LINERATINGINFO_EXT ->_lineRatingInfo


    }
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME,
        RateCache,PolicyLine , rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Unit Owners Rental To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /*private function addWorksheetForCoverage(coverage : EffDated, costData : HOCostData_HOE){
    if(Plugins.get(IRateRoutinePlugin).worksheetsEnabledForLine(PolicyLine.PatternCode)){
      var worksheet = new Worksheet(){ :WorksheetEntries = costData.WorksheetEntries }
      PolicyLine.Branch.addWorksheetFor(coverage, worksheet)
    }
  }*/

  function updateLineCostData(lineCov: HomeownersLineCov_HOE, dateRange: DateRange, rateRoutine: String, rateRoutineMap: Map<CalcRoutineParamName, Object>) {
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, rateRoutine, RateCache, PolicyLine, rateRoutineMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null) {
      addCost(costData)
    }
  }

  /**
   * Adjusting the total discount if it exceeds the maximum discount
   */
  function rateMaximumDiscountAdjustment(dateRange: DateRange) {
    var totalDiscountAmount = _hoRatingInfo.SuperiorConstructionDiscount + _hoRatingInfo.ProtectiveDevicesDiscount + _hoRatingInfo.AffinityDiscount +
        _hoRatingInfo.MultiLineDiscount + _hoRatingInfo.GatedCommunityDiscount + _hoRatingInfo.ConcreteTileRoofDiscount
    if (_hoRatingInfo.AgeOfHomeDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.AgeOfHomeDiscount
    if (_hoRatingInfo.LossHistoryRatingPlan < 0)
      totalDiscountAmount += _hoRatingInfo.LossHistoryRatingPlan
    if (_hoRatingInfo.HigherAllPerilDeductible < 0)
      totalDiscountAmount += _hoRatingInfo.HigherAllPerilDeductible
    if (_hoRatingInfo.BuildingCodeEffectivenessGradingCredit < 0)
      totalDiscountAmount += _hoRatingInfo.BuildingCodeEffectivenessGradingCredit
    if (_hoRatingInfo.PrivateFireCompanyDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.PrivateFireCompanyDiscount
    _hoRatingInfo.DiscountAdjustment = rateMaximumDiscountAdjustment(dateRange, totalDiscountAmount, _hoRatingInfo.AdjustedBaseClassPremium)
  }

  /**
   * Returns the parameter set with a rating info
   */
  private function getHOParameterSet(line: PolicyLine, stateCode: Jurisdiction, dwellingRatingInfo: HOGroup1DwellingRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line: PolicyLine, lineRatingInfo: HOGroup1LineRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getWCPrivateResidenceEmployeeCovParameterSet(line: PolicyLine, wcPrivateResidenceEmployeeRatingInfo: HOWCPrivateResidenceEmployeeRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_LINERATINGINFO_EXT -> wcPrivateResidenceEmployeeRatingInfo
    }
  }

  /**
   *  Returns the parameter set for the Dwelling coverages
   */
  private function getDwellingCovParameterSet(line: PolicyLine, dwellingRatingInfo: HOGroup1DwellingRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  /**
   * Returns the parameter set for the HO Line param set
   */
  private function getHOLineParameterSet(line: PolicyLine, hoLineLevelRatingInfo: HOGroup1LineLevelRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> hoLineLevelRatingInfo
    }
  }

  private function getHOLineDiscountsOrSurchargesParameterSet(line: PolicyLine, discountOrSurchargeRatingInfo: HOGroup1DiscountsOrSurchargeRatingInfo, state: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> state,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
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
  private function getSpecialLimitsPersonalPropertyCovParameterSet(line: PolicyLine, dwellingCov: HODW_SpecialLimitsPP_HOE_Ext): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_SPECIALLIMITSPERSONALPROPERTYRATINGINFO_Ext -> new HOSpecialLimitsPersonalPropertyRatingInfo(dwellingCov)
    }
  }

  /**
 * Returns the parameter set for the OutboardMotors And Watercraft Coverages
 */
  private function getOutboardMotorsAndWatercraftCovParameterSet(line: PolicyLine, item: HOscheduleItem_HOE_Ext, lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_OUTBOARDMOTORSANDWATERCRAFTRATINGINFO_Ext -> new HOOutboardMotorsAndWatercraftRatingInfo(item, lineCov)
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

  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium = (_hoRatingInfo.AdjustedBaseClassPremium + _hoRatingInfo.AgeOfHomeDiscount + _hoRatingInfo.DifferenceInConditions + _hoRatingInfo.SuperiorConstructionDiscount +
        _hoRatingInfo.HigherAllPerilDeductible + _hoRatingInfo.ConcreteTileRoofDiscount + _hoRatingInfo.SeasonalSecondaryResidenceSurcharge +
        _hoRatingInfo.GatedCommunityDiscount + _hoRatingInfo.PrivateFireCompanyDiscount + _hoRatingInfo.VacancySurcharge + _hoRatingInfo.BuildingCodeEffectivenessGradingCredit +
        _hoRatingInfo.AffinityDiscount + _hoRatingInfo.DiscountAdjustment
    )


  }
}