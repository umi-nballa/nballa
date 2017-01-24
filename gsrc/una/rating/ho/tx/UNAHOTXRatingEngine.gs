package una.rating.ho.tx

uses gw.api.domain.covterm.CovTerm
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses una.rating.ho.tx.ratinginfos.HODwellingRatingInfo
uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.ho.common.HOPersonalPropertyRatingInfo
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.tx.ratinginfos.HODiscountsOrSurchargesRatingInfo
uses una.rating.ho.tx.ratinginfos.HOLineRatingInfo
uses una.rating.ho.tx.ratinginfos.HORatingInfo
uses una.rating.util.HOCreateCostDataUtil

uses java.math.BigDecimal
uses java.util.Map
uses una.rating.ho.common.HOScheduledPersonalPropertyRatingInfo
uses una.rating.ho.tx.ratinginfos.HOWatercraftLiabilityCovRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/18/16
 */
class UNAHOTXRatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHOTXRatingEngine.Type.DisplayName
  private var _hoRatingInfo: HORatingInfo
  var _discountOrSurchargeRatingInfo : HODiscountsOrSurchargesRatingInfo
  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    var period = line.Dwelling?.PolicyPeriod
  }

  /**
   * Rate the base premium for the TX HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterTX(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
    updateTotalBasePremium()
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOLI_Med_Pay_HOE:
          rateMedicalPayments(lineCov, dateRange)
          break
      case HOLI_Personal_Liability_HOE:
          ratePersonalLiability(lineCov, dateRange)
          break
      case HOLI_PersonalInjury_HOE:
          ratePersonalInjury(lineCov, dateRange)
          break
      case HOLI_AddResidenceRentedtoOthers_HOE:
          rateAdditionalResidenceRentedToOthersCoverage(lineCov, dateRange)
          break
      case HOLI_AnimalLiabilityCov_HOE_Ext:
          rateAnimalLiabilityCoverage(lineCov, dateRange)
          break
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
          rateUnitOwnersRentalToOthers(lineCov, dateRange, _hoRatingInfo)
          break
      case HOSL_WatercraftLiabilityCov_HOE_Ext:
          rateWatercraftLiabilityCoverage(lineCov, dateRange)
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
      case HODW_Other_Structures_HOE:
          rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
          break
      case HODW_ResidentialGlass_HOE_Ext:
          rateResidentialGlassCoverage(dwellingCov, dateRange)
          break
      case HODW_IdentityTheftExpenseCov_HOE_Ext:
          rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
          break
      case HODW_UnitOwnersOutbuildingCov_HOE_Ext:
          rateUnitOwnersOutbuildingAndOtherStructuresCoverage(dwellingCov, dateRange)
          break
      case HODW_SpecificAddAmt_HOE_Ext:
          rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange, _hoRatingInfo)
          break
      case HODW_Personal_Property_HOE:
          if (dwellingCov?.Dwelling.HOLine.HOPolicyType != typekey.HOPolicyType_HOE.TC_HCONB_EXT and
              dwellingCov.HODW_PersonalPropertyLimit_HOETerm.LimitDifference > 0)
            rateIncreasedPersonalProperty(dwellingCov, dateRange)
          break
      case HODW_ScheduledProperty_HOE:
          rateScheduledPersonalProperty(dwellingCov, dateRange)
          break
      case HODW_SpecialLimitsPP_HOE_Ext:
          rateIncreasedLimitsJewelryWatchesFurs(dwellingCov, dateRange)
          break
      case HODW_LossAssessmentCov_HOE_Ext:
          rateLossAssessmentCoverage(dwellingCov, dateRange)
          break
      case HODW_MoldRemediationCov_HOE_Ext:
          rateMoldRemediationCoverage(dwellingCov, dateRange)
          break
      case HODW_AdditionalInsuredSchedProp:
          rateAdditionalInsuredCoverage(dwellingCov, dateRange)
          break
    }
  }

  /**
   * Function which rates the discounts and surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
    var dwelling = PolicyLine.Dwelling
    _discountOrSurchargeRatingInfo = new HODiscountsOrSurchargesRatingInfo(PolicyLine, _hoRatingInfo.TotalBasePremium)
    if (dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC){
      rateSeasonalOrSecondaryResidenceSurcharge(dateRange)
    }
    if (_discountOrSurchargeRatingInfo.BurglarAlarmReportPoliceStn || _discountOrSurchargeRatingInfo.BurglarAlarmReportCntlStn || _discountOrSurchargeRatingInfo.CompleteLocalBurglarAlarm){
      rateBurglarProtectiveDevicesCredit(dateRange)
    }
    if (PolicyLine.HOPolicyType != typekey.HOPolicyType_HOE.TC_HCONB_EXT){
      rateAgeOfHomeDiscount(dateRange)
    }
    if (dwelling?.HailResistantRoofCredit_Ext){
      rateHailResistantRoofCredit(dateRange)
    }

    if(_discountOrSurchargeRatingInfo.FireAlarmReportFireStn || _discountOrSurchargeRatingInfo.FireAlarmReportCntlStn || _discountOrSurchargeRatingInfo.SprinklerSystemAllAreas)
      rateFireProtectiveDevicesCredit(dateRange)

    if(PolicyLine.Branch.QualifiesAffinityDisc_Ext)
      rateAffinityDiscount(dateRange)

    if(PolicyLine.Branch.PreferredBuilder_Ext != null and _discountOrSurchargeRatingInfo.AgeOfHome < 10)
      ratePreferredBuilderCredit(dateRange)

    if(PolicyLine.MultiPolicyDiscount_Ext){
      _discountOrSurchargeRatingInfo.TypeOfPolicyForMultiLine = PolicyLine.TypeofPolicy_Ext
      rateMultiLineDiscount(dateRange)
    }


    rateMaximumDiscountAdjustment(dateRange)
  }

  /**
   *  Function to rate the Age of Home Discount or Surcharge
   */
  function rateAgeOfHomeDiscount(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAgeOfHomeDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.AGE_OF_HOME_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_AGEOFHOMEDISCOUNTORSURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.AgeOfHomeDiscount = costData?.ActualTermAmount
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Age Of Home Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Burglar Protective Devices credit
   */
  function rateBurglarProtectiveDevicesCredit(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBurglarProtectiveDevicesCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.BURGLAR_PROTECTIVE_DEVICES_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_BURGLARPROTECTIVEDEVICESCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      _hoRatingInfo.BurglarProtectiveDevicesCredit = costData?.ActualTermAmount
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Burglar Protective Devices Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Affinity discount
   */
  function rateAffinityDiscount(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAffinityDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.AFFINITY_DISCOUNT_RATE_ROUTINE, HOCostType_Ext.TC_AFFINITYDISCOUNT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.AffinityDiscount = costData?.ActualTermAmount
    }
    if(_logger.DebugEnabled)
      _logger.debug("Affinity Discount Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Multi Line discount
   */
  function rateMultiLineDiscount(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateMultiLineDiscount", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
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
   *  Function to rate the Preferred Builder Credit
   */
  function ratePreferredBuilderCredit(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePreferredBuilderCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PREFERRED_BUILDER_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_PREFERREDBUILDERCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.PreferredBuilderCredit = costData?.ActualTermAmount
    }
    if(_logger.DebugEnabled)
      _logger.debug("Preferred Builder Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Fire Protective Devices Credit
   */
  function rateFireProtectiveDevicesCredit(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateFireProtectiveDevicesCredit", this.IntrinsicType)
    _discountOrSurchargeRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.FIRE_PROTECTIVE_DEVICES_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_FIREPROTECTIVEDEVICESCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.FireProtectiveDevicesCredit = costData?.ActualTermAmount
    }
    if(_logger.DebugEnabled)
      _logger.debug("Fire Protective Devices Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Hail Resistant Roof Credit
   */
  function rateHailResistantRoofCredit(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateHailResistantRoofCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineParameterSet(PolicyLine, _discountOrSurchargeRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HAIL_RESISTANT_ROOF_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_HAILRESISTANTROOFCREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.HailResistantRoofCredit = costData?.ActualTermAmount
    }
    if(_logger.DebugEnabled)
      _logger.debug("Hail Resistant Roof Credit Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Seasonal Or Secondary Residence Surcharge
   */
  function rateSeasonalOrSecondaryResidenceSurcharge(dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSeasonalOrSecondaryResidenceSurcharge", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateSeasonalOrSecondaryResidenceSurcharge(dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGE, _discountOrSurchargeRatingInfo)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Seasonal And Secondary Residence Surcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the unit owners - Rental to other coverage
   */
  function rateUnitOwnersRentalToOthers(lineCov: HOLI_UnitOwnersRentedtoOthers_HOE_Ext, dateRange: DateRange, hoRatingInfo: HORatingInfo) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersRentalToOthers to rate Unit Owners Rental To Others Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    lineRatingInfo.TotalBasePremium = hoRatingInfo.TotalBasePremium
    //need to update with the total base premium
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Unit Owners Rental To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the watercraft liability coverage for Texas
   */
  function rateWatercraftLiabilityCoverage(lineCov: HOSL_WatercraftLiabilityCov_HOE_Ext, dateRange: DateRange) {
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
   * Rate the medical payments coverage
   */
  function rateMedicalPayments(lineCov: HOLI_Med_Pay_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateMedicalPayments to rate Medical Payments Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.MEDICAL_PAYMENTS_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount != 0){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Medical Payments Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the personal liability coverage
   */
  function ratePersonalLiability(lineCov: HOLI_Personal_Liability_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalLiability to rate Personal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_LIABILITY_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount != 0){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Personal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the additional residence rented to others coverage
   */
  function rateAdditionalResidenceRentedToOthersCoverage(lineCov: HOLI_AddResidenceRentedtoOthers_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalResidenceRentedToOthersCoverage to rate Additional Residence Rented To Others Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_RESIDENCE_RENTED_TO_OTHERS_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Additional Residence Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov: HOLI_AnimalLiabilityCov_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Animal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate personal injury line coverage
   */
  function ratePersonalInjury(lineCov: HOLI_PersonalInjury_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalInjury to rate Personal Injury Coverage", this.IntrinsicType)
    var lineRatingInfo = new HOLineRatingInfo(lineCov)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Loss Assessment Coverage line coverage
   */
  function rateLossAssessmentCoverage(dwellingCov: HODW_LossAssessmentCov_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    if (dwellingRatingInfo.LossAssessmentLimit != 0) {
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null){
        if (costData.ActualTermAmount == 0)
          costData.ActualTermAmount = 1
        addCost(costData)
      }
    }
    if(_logger.DebugEnabled)
      _logger.debug("Loss Assessment Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Loss Assessment Coverage line coverage
   */
  function rateMoldRemediationCoverage(dwellingCov: HODW_MoldRemediationCov_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateMoldRemediationCoverage to rate Mold Remediation Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.MOLD_REMEDIATION_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Mold Remediation Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Scheduled Personal property
   */
  function rateScheduledPersonalProperty(dwellingCov: HODW_ScheduledProperty_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateScheduledPersonalProperty to rate Personal Property Scheduled Coverage", this.IntrinsicType)
    for (item in dwellingCov.ScheduledItems) {
      var rateRoutineParameterMap = getScheduledPersonalPropertyCovParameterSet(PolicyLine, item)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SCHEDULED_PERSONAL_PROPERTY_COV_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null){
        if (costData.ActualTermAmount == 0)
          costData.ActualTermAmount = 1
        addCost(costData)
      }
    }
    if(_logger.DebugEnabled)
      _logger.debug("Scheduled Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Personal property - Increased limits coverage
   */
  function rateIncreasedPersonalProperty(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Addition insured coverage
   */
  function rateAdditionalInsuredCoverage(dwellingCov: HODW_AdditionalInsuredSchedProp, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalInsuredCoverage to rate Additional Insured Coverage", this.IntrinsicType)
    if(dwellingCov?.ScheduledItems?.Count > 0) {
      var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ADDITIONAL_INSURED_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Additional Insured Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Identity Theft Expense Coverage coverage
   */
  function rateIdentityTheftExpenseCoverage(dwellingCov: HODW_IdentityTheftExpenseCov_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateIdentityTheftExpenseCoverage to rate Identity Theft Expense Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateIdentityTheftExpenseCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Identity Theft Expense Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Equipment breakdown coverage
   */
  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate Other structures - Increased or decreased Limits coverage for HCONB
   */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: HODW_Other_Structures_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    if (dwellingRatingInfo.OtherStructuresIncreasedLimit != 0){
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null){
        addCost(costData)
      }
    }
    if(_logger.DebugEnabled)
      _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Unit Owners Outbuilding and Other Structures Coverage
   */
  function rateUnitOwnersOutbuildingAndOtherStructuresCoverage(dwellingCov: HODW_UnitOwnersOutbuildingCov_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersOutbuildingAndOtherStructuresCoverage to rate Unit Owners Outbuilding and Other Structures Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.UNIT_OWNERS_OUTBUILDINGS_AND_OTHER_STRUCTURES_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Unit Owners Outbuilding and Other Structures Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange, hoRatingInfo: HORatingInfo) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    dwellingRatingInfo.TotalBasePremium = hoRatingInfo.TotalBasePremium
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      if (costData.ActualTermAmount == 0)
        costData.ActualTermAmount = 1
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Residential Glass Coverage
   */
  function rateResidentialGlassCoverage(dwellingCov: HODW_ResidentialGlass_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateResidentialGlassCoverage to rate Residential Glass Coverage", this.IntrinsicType)
    if (dwellingCov.Dwelling.HODW_ResidentialGlass_HOE_Ext.HODW_Unscheduled_HOE_ExtTerm?.DisplayValue == "Yes"){
      var rateRoutineParameterMap = HOCommonRateRoutinesExecutor.getHOCWParameterSet(PolicyLine)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.RESIDENTIAL_GLASS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null){
        addCost(costData)
      }
    }
    if(_logger.DebugEnabled)
      _logger.debug("Residential Glass Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Increased Limits Jewelry Watches Furs
   */
  function rateIncreasedLimitsJewelryWatchesFurs(dwellingCov: HODW_SpecialLimitsPP_HOE_Ext, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedLimitsJewelryWatchesFurs to rate Increased Limits Jewelry Watches Furs", this.IntrinsicType)
    var dwellingRatingInfo = new HODwellingRatingInfo(dwellingCov)
    var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, dwellingRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.INCREASED_LIMITS_JEWELRY_WATCHES_FURS, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount > 0){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Increased Limits Jewelry Watches Furs Rated Successfully", this.IntrinsicType)
  }

  /**
   * Adjusting the total discount if it exceeds the maximum discount
  */
  function rateMaximumDiscountAdjustment(dateRange : DateRange){
    var totalDiscountAmount = _hoRatingInfo.FireProtectiveDevicesCredit + _hoRatingInfo.BurglarProtectiveDevicesCredit + _hoRatingInfo.AffinityDiscount +
                              _hoRatingInfo.PreferredBuilderCredit + _hoRatingInfo.HailResistantRoofCredit + _hoRatingInfo.MultiLineDiscount
    if(_hoRatingInfo.AgeOfHomeDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.AgeOfHomeDiscount
    rateMaximumDiscountAdjustment(dateRange, totalDiscountAmount, _hoRatingInfo.TotalBasePremium)
  }

  /**
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line: PolicyLine, lineRatingInfo: HOLineRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Dwelling level coverages
   */
  private function getWatercraftLiabilityCovParameterSet(item: HOscheduleItem_HOE_Ext, lineCov: HOSL_WatercraftLiabilityCov_HOE_Ext): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> PolicyLine,
        TC_OUTBOARDMOTORSANDWATERCRAFTRATINGINFO_Ext -> new HOWatercraftLiabilityCovRatingInfo(item, lineCov)
    }
  }

  /**
   * Returns the parameter set for the Dwelling level coverages
   */
  private function getDwellingCovParameterSet(line: PolicyLine, dwellingRatingInfo: HODwellingRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  /**
   * Returns the parameter set for the Dwelling level coverages
   */
  private function getScheduledPersonalPropertyCovParameterSet(line: PolicyLine, item: ScheduledItem_HOE): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_SCHEDULEDPERSONALPROPERTYRATINGINFO_Ext -> new HOScheduledPersonalPropertyRatingInfo(item)
    }
  }

  /**
   * Returns the parameter set for the discounts or surcharges
   */
  private function getHOLineParameterSet(line: PolicyLine, discountOrSurchargeRatingInfo: HODiscountsOrSurchargesRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
    }
  }

  /*private function addWorksheetForCoverage(coverage : EffDated, costData : HOCostData_HOE){
    if(Plugins.get(IRateRoutinePlugin).worksheetsEnabledForLine(PolicyLine.PatternCode)){
      var worksheet = new Worksheet(){ :WorksheetEntries = costData.WorksheetEntries }
      PolicyLine.Branch.addWorksheetFor(coverage, worksheet)
    }
  }*/

  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium += (_hoRatingInfo.FinalAdjustedBaseClassPremium + _hoRatingInfo.ReplacementCostDwellingPremium +
        _hoRatingInfo.ReplacementCostPersonalPropertyPremium + _hoRatingInfo.HOAPlusCoveragePremium)
  }
}