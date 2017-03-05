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

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 11:00 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAHONCRatingEngine extends UNAHORatingEngine_HOE<HomeownersLine_HOE> {
  final static var _logger = UnaLoggerCategory.UNA_RATING
  private static final var CLASS_NAME = UNAHONCRatingEngine.Type.DisplayName
  private var _hoRatingInfo: HORatingInfo
  private var _discountsOrSurchargeRatingInfo : HONCDiscountsOrSurchargeRatingInfo
  private var _lineRateRoutineParameterMap : Map<CalcRoutineParamName, Object>
  private var _lineRatingInfo : HONCLineRatingInfo
  private var _dwellingRatingInfo : HONCDwellingRatingInfo
  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _lineRatingInfo = new HONCLineRatingInfo(line)
    _dwellingRatingInfo = new HONCDwellingRatingInfo(line.Dwelling)

  }

  /**
   * Rate the base premium
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterNC(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
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
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_RESIDENCE_RENTED_TO_OTHERS_COVERAGE_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOLI_UnitOwnersRentedtoOthers_HOE_Ext:
          updateLineCostData(lineCov, dateRange, HORateRoutineNames.UNIT_OWNERS_RENTED_TO_OTHERS_COV_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
      case HOSL_OutboardMotorsWatercraft_HOE_Ext:
          rateWatercraftLiabilityCoverage(lineCov, dateRange)
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
      case HODW_LossAssessmentCov_HOE_Ext:
            rateLossAssessmentCoverage(dwellingCov, dateRange)
          break
      case HODW_UnitOwnersCovASpecialLimits_HOE_Ext:
        //  rateUnitOwnerCovASpecialLimitsCoverage(dwellingCov, dateRange)
          break
      case HODW_PermittedIncOcp_HOE_Ext:
          ratePermittedIncidentalOccupanciesCoverage(dwellingCov, dateRange)
          break
      case HODW_Earthquake_HOE:
          rateEarthquakeCoverage(dwellingCov, dateRange)
          break




    }

    }

/*  *//**
   * Rate the additional residence rented to others coverage
   *//*
  function rateAdditionalResidenceRentedToOthersCoverage(lineCov: HOLI_AddResidenceRentedtoOthers_HOE, dateRange: DateRange) {
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateAdditionalResidenceRentedToOthersCoverage to rate Additional Residence Rented To Others Coverage", this.IntrinsicType)
    var lineRatingInfo = new HONCLineRatingInfo(lineCov.HOLine)
    var rateRoutineParameterMap = getLineCovParameterSet(PolicyLine, lineRatingInfo, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForLineCoverages(lineCov, dateRange, HORateRoutineNames.ADDITIONAL_RESIDENCE_RENTED_TO_OTHERS_COVERAGE_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null){
      addCost(costData)
    }
    if(_logger.DebugEnabled)
      _logger.debug("Additional Residence Rented To Others Coverage Rated Successfully", this.IntrinsicType)
  }*/

  function rateEarthquakeCoverage(dwellingCov : HODW_Earthquake_HOE, dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateEarthquakeCoverage ", this.IntrinsicType)
    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, _dwellingRatingInfo)
    var rateRoutineName = ""
    var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, rateRoutineName, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("Earthquake Coverage Rated Successfully", this.IntrinsicType)
  }

  function rateUnitOwnerCovASpecialLimitsCoverage(dwellingCov: HODW_UnitOwnersCovASpecialLimits_HOE_Ext , dateRange : DateRange){
    if (_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateUnitOwnerCovASpecialLimitsCoverage", this.IntrinsicType)
      var rateRoutineParameterMap = getDwellingCovParameterSet(PolicyLine, _dwellingRatingInfo, PolicyLine.BaseState.Code)
      var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.LOSS_ASSESSMENT_COVERAGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      if (costData != null)
        addCost(costData)
    if (_logger.DebugEnabled)
      _logger.debug("rateUnitOwnerCovASpecialLimitsCoverage Rated Successfully", this.IntrinsicType)

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
    _logger.debug("Entering " + CLASS_NAME + ":: rateEquipmentBreakdownCoverage to rate Equipment Breakdown Coverage", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateEquipmentBreakdownCoverage(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)
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
//    _logger.debug("Water Backup Sump Overflow Coverage Rated Successfully", this.IntrinsicType)
//  }

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