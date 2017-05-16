package una.rating.ho.hawaii

uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.logging.UnaLoggerCategory
uses java.util.Map
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange
uses una.rating.ho.hawaii.ratinginfos.HORatingInfo
uses una.rating.ho.hawaii.ratinginfos.HOHIDiscountsOrSurchargeRatingInfo
uses una.rating.ho.hawaii.ratinginfos.HOLineRatingInfo
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.hawaii.ratinginfos.HOHIDwellingRatingInfo
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.ho.hawaii.ratinginfos.HOOutboardMotorsAndWatercraftRatingInfo
uses una.rating.ho.hawaii.ratinginfos.HOAddResidenceRentedToOthersCovRatingInfo
uses una.rating.ho.common.HOScheduledPersonalPropertyRatingInfo
uses una.rating.ho.common.HOSpecialLimitsPersonalPropertyRatingInfo
uses una.rating.ho.hawaii.ratinginfos.HOHIProtectiveDeviceDetailsRatingInfo
uses gw.rating.CostData
uses pcf.PolicyInfoInputSet
uses pcf.AdditionalInsuredInfoDV

/**
 * Created withrentedtoothers IntelliJ IDEA.
 * User: ssok
 * Date: 1/31/17
 * Time: 2:17 PM
 * To change this template use File | Settings | File Templates.
 */
class UNAHOHIRatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
    final static var _logger = UnaLoggerCategory.UNA_RATING
    private static final var CLASS_NAME = UNAHOHIRatingEngine.Type.DisplayName
    private var _hoRatingInfo: HORatingInfo
    private var _discountsOrSurchargeRatingInfo : HOHIDiscountsOrSurchargeRatingInfo
    private var _protectiveDeviceRatingInfo : HOHIProtectiveDeviceDetailsRatingInfo
    private var _lineRateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    private var _lineRatingInfo : HOLineRatingInfo
    private var _dwellingRatingInfo : HOHIDwellingRatingInfo
    private var _hasExecutiveCoverage: boolean as HasExecutiveCoverage
    construct(line: HomeownersLine_HOE) {
      this(line, RateBookStatus.TC_ACTIVE)
    }

    construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
      super(line, minimumRatingLevel)
      _hoRatingInfo = new HORatingInfo()
      _lineRatingInfo = new HOLineRatingInfo(line)
      _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
      _dwellingRatingInfo = new HOHIDwellingRatingInfo(line.Dwelling)
      _hasExecutiveCoverage = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HasHODW_ExecutiveCov_HOE_ExtTerm ? line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_ExecutiveCov_HOE_ExtTerm?.Value : false
    }

/**
 * Rate the base premium
 */
    override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
      var rater = new HOBasePremiumRaterHI(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
      var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
      addCosts(costs)
    }


    override function rateHOLineCosts(dateRange: DateRange){
      var dwelling = PolicyLine.Dwelling
      _discountsOrSurchargeRatingInfo = new HOHIDiscountsOrSurchargeRatingInfo (PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
      _protectiveDeviceRatingInfo = new HOHIProtectiveDeviceDetailsRatingInfo(PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)

      rateHigherAllPerilDeductible(dateRange)
      rateAgeOfHomeDiscount(dateRange)

      if (PolicyLine.Branch.QualifiesAffinityDisc_Ext) {
        rateAffinityDiscount(dateRange)
      }
      if(_discountsOrSurchargeRatingInfo.ClaimFreeYears != 0 and _discountsOrSurchargeRatingInfo.PriorLosses != 0){
        rateLossHistoryCredit(dateRange)
      }
      if(_discountsOrSurchargeRatingInfo.DwellingOccupancy == typekey.DwellingOccupancyType_HOE.TC_VACANT){
        rateVacancySurcharge(dateRange)
      }

      if(_discountsOrSurchargeRatingInfo.tenantSeasonal != null){
        rateTenantSeasonalSurcharge(dateRange)
      }

      if(PolicyLine.MultiPolicyDiscount_Ext){
        _discountsOrSurchargeRatingInfo.TypeOfPolicyForMultiLine = PolicyLine.TypeofPolicy_Ext
        rateMultiLineDiscount(dateRange)
      }

      if (PolicyLine.AdditionalInsureds.hasMatch
          ( \ elt1 -> elt1.PolicyAdditionalInsuredDetails.hasMatch( \ elt2 -> elt2.AdditionalInsuredType == typekey.AdditionalInsuredType.TC_PROPERTY_MANAGER ))){
        rateAdditionalInsuredPropertyManager(dateRange)
      }




      rateMaximumDiscountAdjustment(dateRange)

      //update the total base premium with the discounts and surcharges
      updateTotalBasePremium()

      if (dwelling?.HODW_Personal_Property_HOEExists and (!HasExecutiveCoverage)){
        if (dwelling?.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm?.Value == tc_PersProp_ReplCost){
          ratePersonalPropertyReplacementCost(dateRange)
        }
      }

      rateProtectiveDeviceCredit(dateRange)
    }

    override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange){
      switch(typeof dwellingCov){
        case DPDW_OrdinanceCov_HOE:
            rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
            break
        case DPDW_Personal_Property_HOE:
            rateIncreasedPersonalProperty(dwellingCov, dateRange)
            break
        case HODW_WaterBackUpSumpOverflow_HOE_Ext:
            if (!HasExecutiveCoverage)
              rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
            break
        case HODW_EquipBreakdown_HOE_Ext:
            rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
            break
        case HODW_Personal_Property_HOE:
            if (PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3)
              rateIncreasedPersonalPropertyHO(dwellingCov, dateRange)
            break
        case HODW_Other_Structures_HOE:
            rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
            break
        case HODW_LossAssessmentCov_HOE_Ext:
            if(PolicyLine.HOPolicyType != HOPolicyType_HOE.TC_HO4)
              rateLossAssessmentCoverage(dwellingCov, dateRange)
            break
        case HODW_ScheduledProperty_HOE:
            rateScheduledPersonalProperty(dwellingCov, dateRange)
            break
        case HODW_SpecialLimitsPP_HOE_Ext:
            rateSpecialLimitsPersonalPropertyCoverage(dwellingCov, dateRange)
            break
        case HODW_PermittedIncOcp_HOE_Ext:
            ratePermittedIncidentalOccupanciesCoverage(dwellingCov, dateRange)
            break
        case HODW_SpecialComp_HOE_Ext:
            rateSpecialComputerCoverage(dwellingCov, dateRange)
            break
        case HODW_RefrigeratedPP_HOE_Ext:
            if (!HasExecutiveCoverage)
              rateRefrigeratedPersonalPropertyCoverage(dwellingCov, dateRange)
            break
        case HODW_IdentityTheftExpenseCov_HOE_Ext:
            rateIdentityTheftExpenseCoverage(dwellingCov, dateRange)
            break
        case HODW_CC_EFT_HOE_Ext:
            if(_dwellingRatingInfo.CCEFTAccessDeviceForgeryCounterfeitMoney > 500)
            rateCreditCardEFTCoverage(dwellingCov, dateRange)
            break
        case HODW_OrdinanceCov_HOE:
            if (!HasExecutiveCoverage)
              rateOrdinanceOrLawCoverageHO(dwellingCov, dateRange)
            break
        case HODW_SpecificAddAmt_HOE_Ext:
            if (!HasExecutiveCoverage)
              rateSpecifiedAdditionalAmountCoverage(dwellingCov, dateRange)
            break
        case HODW_Dwelling_Cov_HOE:
            if (HasExecutiveCoverage)
              rateExecutiveCoverage(dwellingCov, dateRange)
            if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO6 and dwellingCov?.HODW_Dwelling_Limit_HOETerm?.Value > 30000){
              rateUnitOwnersCovAIncreasedLimit(dwellingCov, dateRange)
             }
      break
        case HODW_BusinessProperty_HOE_Ext:
            rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov, dateRange)
            break
        /*case HODW_HurricaneCov_HOE_Ext:
            rateHurricaneCoverage(dwellingCov, dateRange)
            break*/

        case HODW_BuildingAdditions_HOE_Ext:
            if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO4)
              rateBuildingAdditionsAndAlterationsIncreasedLimitsCoverage(dwellingCov, dateRange)
            break
        case HODW_UnitOwnersCovASpecialLimits_HOE_Ext:
            rateUnitOwnersCovASpecialLimitsCoverage(dwellingCov, dateRange)
            break

      }
    }

  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
      case HOSL_OutboardMotorsWatercraft_HOE_Ext:
          rateOutboardMotorsAndWatercraftCoverage(lineCov, dateRange)
          break
      case HOLI_PersonalInjury_HOE:
          ratePersonalInjuryCoverage(lineCov, dateRange)
          break
      case HOLI_AddResidenceRentedtoOthers_HOE:
          rateAddResidenceRentedToOthersCoverage(lineCov, dateRange)
          break
      case HOLI_AnimalLiabilityCov_HOE_Ext:
          rateAnimalLiabilityCoverage(lineCov, dateRange)
          break
      case HOLI_Personal_Liability_HOE:
          rateIncreasedSectionIILimits(lineCov, dateRange)
          break
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
          rateUnitOwnersRentedToOthersCoverage(lineCov, dateRange)
          break
    }
  }

  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm, _discountsOrSurchargeRatingInfo)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }


  function rateAdditionalInsuredPropertyManager( dateRange: DateRange) {
    if (_logger.DebugEnabled)
       _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalInsuredPropertyManager", this.IntrinsicType)
        var rateRoutineParameterMap = _lineRateRoutineParameterMap
        var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.ADDITIONAL_INSURED_RATE_ROUTINE,
                    typekey.HOCostType_Ext.TC_ADDITIONALINSURED, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
        addCost(costData)
    if (_logger.DebugEnabled)
        _logger.debug("rateAdditionalInsuredPropertyManager Rated Successfully", this.IntrinsicType)
    }


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

  function rateIncreasedPersonalProperty(dwellingCov: DPDW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateIncreasedPersonalPropertyHO(dwellingCov: HODW_Personal_Property_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedPersonalProperty to rate Personal Property Increased Limit Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Property Increased Limit Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
  * Rate Other structures - Increased or decreased Limits coverage
  */
  function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov: HODW_Other_Structures_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOtherStructuresIncreasedOrDecreasedLimits to rate Other Structures Increased Or Decreased Limits Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.OTHER_STRUCTURES_INCREASED_OR_DECREASED_LIMITS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Other Structures Increased Or Decreased Limits Coverage Rated Successfully", this.IntrinsicType)
  }


  /**
   * Rate the Loss assessment Coverage
   */
  function rateLossAssessmentCoverage(dwellingCov: HODW_LossAssessmentCov_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateLossAssessmentCoverage to rate Loss Assessment Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.LossAssessmentLimit > dwellingCov.HOPL_LossAssCovLimit_HOETerm.RuntimeDefault){
      var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Loss Asssessment Coverage Rated Successfully", this.IntrinsicType)
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
    _logger.debug("Entering " + CLASS_NAME + ":: rateSpecialLimitsPersonalPropertyCoverage to rate Special Limits Personal Property Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getSpecialLimitsPersonalPropertyCovParameterSet(PolicyLine, dwellingCov)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIAL_LIMITS_PERSONAL_PROPERTY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Special Limits Personal Property Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Permitted Incidental Occupancies Coverage
   */
  function ratePermittedIncidentalOccupanciesCoverage(dwellingCov: HODW_PermittedIncOcp_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePermittedIncidentalOccupanciesCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.PERMITTED_INCIDENTAL_OCCUPANCIES_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Permitted Incidental Occupancies Coverage Rated Successfully", this.IntrinsicType)
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
 * Rate Unit Owners Rented To Others Coverage
 */
  function rateUnitOwnersRentedToOthersCoverage(lineCov: HOLI_UnitOwnersRentedtoOthers_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersRentedToOthersCoverage to rate Unit Owners Rented To Others Coverage", this.IntrinsicType)
    _lineRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_STATE -> BaseState,
        TC_LINERATINGINFO_EXT -> _lineRatingInfo}
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Unit Owners Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Unit Owners CovA Special Limits Coverage
   */
  function rateUnitOwnersCovASpecialLimitsCoverage(dwellingCov: HODW_UnitOwnersCovASpecialLimits_HOE_Ext, dateRange: DateRange){
    _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnersCovASpecialLimitsCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.UNIT_OWNERS_COVA_SPECIAL_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Unit Owners CovA Special Limits Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate the Credit Card, EFT, Access Device, Forgery and Counterfeit Money
   */
  function rateCreditCardEFTCoverage(dwellingCov: HODW_CC_EFT_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateCreditCardEFTCoverage to rate the Credit Card, EFT, Access Device, Forgery and Counterfeit Money", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.CC_EFT_ACCESSDEVICE_FORGERY_AND_COUNTERFEIT_MONEY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverageHO(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the specified additional amount for coverage A
   */
  function rateSpecifiedAdditionalAmountCoverage(dwellingCov: HODW_SpecificAddAmt_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSpecifiedAdditionalAmountCoverage to rate Specified Additional Amount Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.SPECIFIED_ADDITIONAL_AMOUNT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Specified Additional Amount Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate the Business property - Increased Limits
   */
  function rateBusinessPropertyIncreasedLimitsCoverage(dwellingCov: HODW_BusinessProperty_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateBusinessPropertyIncreasedLimitsCoverage to rate Business Property Increased Limits Coverage", this.IntrinsicType)
    if (_dwellingRatingInfo.BusinessPropertyIncreasedLimit > 0){
      var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.BUSINESS_PROPERTY_INCREASED_LIMITS_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Business Property Increased Limits Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Hurricane coverage
   */
  function rateHurricaneCoverage(dwellingCov: HODW_HurricaneCov_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateHurricaneCoverage to rate Hurricane Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.HURRICANE_COV_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Hurricane Coverage Rated Successfully", this.IntrinsicType)
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
   * Function which rates the Personal property replacement cost
   */
  function ratePersonalPropertyReplacementCost(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyReplacementCost", this.IntrinsicType)
    var costDataForIncreasedPersonalProperty : CostData = null
    if(PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_HO3){
      var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
      costDataForIncreasedPersonalProperty = HOCreateCostDataUtil.createCostDataForDwellingCoverage(PolicyLine.Dwelling?.HODW_Dwelling_Cov_HOE, dateRange,
          HORateRoutineNames.PERSONAL_PROPERTY_INCREASED_LIMIT_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    }
    _discountsOrSurchargeRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
    _discountsOrSurchargeRatingInfo.IncreasedPersonalPropertyPremium = costDataForIncreasedPersonalProperty?.ActualTermAmount
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_REPLACEMENTCOSTONPERSONALPROPERTY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Personal Property Replacement Cost Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate Protection Devices Credit
   */
  function rateProtectiveDeviceCredit(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateProtectiveDeviceCredit", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineProtectiveDeviceDetailsParameterSet(PolicyLine, _protectiveDeviceRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.PROTECTIVE_DEVICE_CREDIT_RATE_ROUTINE, HOCostType_Ext.TC_PROTECTIVEDEVICECREDIT,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    _hoRatingInfo.ProtectiveDevicesDiscount = costData?.ActualTermAmount
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Protection Devices Credit Rated Successfully", this.IntrinsicType)
  }

  function rateTenantSeasonalSurcharge(dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateTenantSeasonalSurcharge", this.IntrinsicType)
    var rateRoutineParameterMap = getHOLineDiscountsOrSurchargesParameterSet(PolicyLine, _discountsOrSurchargeRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.SEASONAL_OR_SECONDARY_RESIDENCE_SURCHARGE_RATE_ROUTINE, HOCostType_Ext.TC_SEASONALORSECONDARYRESIDENCESURCHARGE,
        RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
      _hoRatingInfo.SeasonalSecondaryResidenceSurcharge = costData?.ActualTermAmount
    }
    if (_logger.DebugEnabled)
      _logger.debug("rateTenantSeasonalSurcharge Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: DPDW_OrdinanceCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
    if (dwellingCov?.Dwelling?.DPDW_OrdinanceCov_HOE.DPDW_OrdinanceLimit_HOETerm.DisplayValue == "25%"){
      var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Function to rate the Vacant Dwellings
   */
  function rateVacancySurcharge(dateRange: DateRange) {
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
   * Rate the Outboard Motors and Watercraft coverage
   */
  function rateOutboardMotorsAndWatercraftCoverage(lineCov: HOSL_OutboardMotorsWatercraft_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateOutboardMotorsAndWatercraftCoverage", this.IntrinsicType)
    for (item in lineCov.scheduledItem_Ext) {
      var rateRoutineParameterMap = getOutboardMotorsAndWatercraftCovParameterSet(PolicyLine, item, lineCov)
      var costData = HOCreateCostDataUtil.createCostDataForScheduledLineCoverage(lineCov, dateRange, HORateRoutineNames.OUTBOARD_MOTORS_AND_WATERCRAFT_COV_HI_ROUTINE_NAME, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    if (_logger.DebugEnabled)
      _logger.debug("Outboard Motors and Watercraft Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate personal injury line coverage
   */
  function ratePersonalInjuryCoverage(lineCov: HOLI_PersonalInjury_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalInjury to rate Personal Injury Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    _logger.debug("Personal Injury Coverage Rated Successfully", this.IntrinsicType)
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
   * Rate Animal Liability Coverage
   */
  function rateAnimalLiabilityCoverage(lineCov: HOLI_AnimalLiabilityCov_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateAnimalLiabilityCoverage to rate Animal Liability Coverage", this.IntrinsicType)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
    if(_lineRatingInfo.AnimalLiabilityLimit != 0){
      var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ANIMAL_LIABILITY_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    }
    _logger.debug("Animal Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   *  Rate the Increased Section II Limits
   */
  function rateIncreasedSectionIILimits(lineCov: HOLI_Personal_Liability_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateIncreasedSectionIILimits to rate Increased Section II Limits", this.IntrinsicType)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.INCREASED_SECTION_II_LIMITS_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null and costData.ActualTermAmount != 0)
      addCost(costData)
    _logger.debug("Increased Section II Limits Rated Successfully", this.IntrinsicType)
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
  private function getLineCovParameterSet(line: PolicyLine, lineRatingInfo: HOLineRatingInfo, stateCode: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }

    private function getHOLineDiscountsOrSurchargesParameterSet(line: PolicyLine, discountOrSurchargeRatingInfo: HOHIDiscountsOrSurchargeRatingInfo, state: Jurisdiction): Map<CalcRoutineParamName, Object> {
      return {
          TC_POLICYLINE -> line,
          TC_STATE -> state,
          TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo
      }
    }

  private function getHOLineProtectiveDeviceDetailsParameterSet(line: PolicyLine, protectiveDeviceRatingInfo: HOHIProtectiveDeviceDetailsRatingInfo, state: Jurisdiction): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> state,
        TC_PROTECTIVEDEVICEDETAILSRATINGINFO_EXT -> protectiveDeviceRatingInfo
    }
  }

  /**
   * Returns the parameter set with a rating info
   */
  private function getHOParameterSet(line: PolicyLine, stateCode: Jurisdiction, dwellingRatingInfo : HOHIDwellingRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_RATINGINFO -> _hoRatingInfo,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
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
   * Adjusting the total discount if it exceeds the maximum discount
   */
  function rateMaximumDiscountAdjustment(dateRange: DateRange) {
    var totalDiscountAmount =  _hoRatingInfo.ProtectiveDevicesDiscount + _hoRatingInfo.AffinityDiscount + _hoRatingInfo.MultiLineDiscount
    if (_hoRatingInfo.AgeOfHomeDiscount < 0)
      totalDiscountAmount += _hoRatingInfo.AgeOfHomeDiscount
    if (_hoRatingInfo.LossHistoryRatingPlan < 0)
      totalDiscountAmount += _hoRatingInfo.LossHistoryRatingPlan
    if (_hoRatingInfo.HigherAllPerilDeductible < 0)
      totalDiscountAmount += _hoRatingInfo.HigherAllPerilDeductible

    _hoRatingInfo.DiscountAdjustment = rateMaximumDiscountAdjustment(dateRange, totalDiscountAmount, _hoRatingInfo.AdjustedBaseClassPremium)
  }


  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium = (_hoRatingInfo.AdjustedBaseClassPremium +_hoRatingInfo.VacancySurcharge  +
        _hoRatingInfo.AffinityDiscount + _hoRatingInfo.DiscountAdjustment  + _hoRatingInfo.MultiLineDiscount
    )
    _dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium

  }
}