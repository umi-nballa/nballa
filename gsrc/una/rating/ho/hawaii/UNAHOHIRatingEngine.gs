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

/**
 * Created with IntelliJ IDEA.
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
    private var _lineRateRoutineParameterMap : Map<CalcRoutineParamName, Object>
    private var _lineRatingInfo : HOLineRatingInfo
    private var _dwellingRatingInfo : HOHIDwellingRatingInfo
    construct(line: HomeownersLine_HOE) {
      this(line, RateBookStatus.TC_ACTIVE)
    }

    construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
      super(line, minimumRatingLevel)
      _hoRatingInfo = new HORatingInfo()
      _lineRatingInfo = new HOLineRatingInfo(line)
      _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)
      _dwellingRatingInfo = new HOHIDwellingRatingInfo(line.Dwelling)

    }

/**
 * Rate the base premium
 */
    override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
      var rater = new HOBasePremiumRaterHI (dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
      var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
      addCosts(costs)
    }


    override function rateHOLineCosts(dateRange: DateRange){
      var dwelling = PolicyLine.Dwelling
      _discountsOrSurchargeRatingInfo = new HOHIDiscountsOrSurchargeRatingInfo (PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)

      if (PolicyLine.Branch.QualifiesAffinityDisc_Ext) {
        rateAffinityDiscount(dateRange)
      }

      rateLossHistoryCredit(dateRange)

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
      //update the total base premium with the discounts and surcharges
      updateTotalBasePremium()
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
            rateWaterBackupSumpOverflowCoverage(dwellingCov, dateRange)
            break
        case HODW_EquipBreakdown_HOE_Ext:
            rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
            break



      }

    }

  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {         //TODO addins_update
//      case HOLI_AdditionalInsuredSchedPropertyManager:
//          rateAdditionalInsuredPropertyManager(lineCov, dateRange)
//          break
    }
  }

  function rateEquipmentBreakdownCoverage(dwellingCov: HODW_EquipBreakdown_HOE_Ext, dateRange: DateRange) {
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Equipment Breakdown Coverage Rated Successfully", this.IntrinsicType)
  }

  //TODO addins_update
//  function rateAdditionalInsuredPropertyManager(lineCov: HOLI_AdditionalInsuredSchedPropertyManager, dateRange: DateRange) {
//    if (_logger.DebugEnabled)
//      _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalInsuredPropertyManager", this.IntrinsicType)
//    for (item in lineCov.scheduledItem_Ext) {
//      var rateRoutineParameterMap = _lineRateRoutineParameterMap
//      var costData = HOCreateCostDataUtil.createCostDataForScheduledLineCoverage(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_INSURED_PROPERTY_MANAGER_RATE_ROUTINE, item, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
//      if (costData != null)
//        addCost(costData)
//    }
//    if (_logger.DebugEnabled)
//      _logger.debug("rateAdditionalInsuredPropertyManager Rated Successfully", this.IntrinsicType)
//  }
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

  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium = (_hoRatingInfo.AdjustedBaseClassPremium +_hoRatingInfo.VacancySurcharge  +
        _hoRatingInfo.AffinityDiscount + _hoRatingInfo.DiscountAdjustment  + _hoRatingInfo.MultiLineDiscount
    )
    _dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium

  }
}