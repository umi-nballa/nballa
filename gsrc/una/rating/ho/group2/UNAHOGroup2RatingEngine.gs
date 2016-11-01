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

uses java.util.Map
uses una.rating.ho.common.HOCommonRateRoutinesExecutor
uses una.rating.ho.group2.ratinginfos.HOGroup2DwellingRatingInfo
uses una.rating.ho.group2.ratinginfos.HOGroup2LineRatingInfo

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
  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState.Code)

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
      case HOLI_PersonalInjury_HOE:
          //updateLineCostData(lineCov, dateRange, HORateRoutineNames.PERSONAL_INJURY_COVERAGE_GROUP1_ROUTINE_NAME, _lineRateRoutineParameterMap)
          break
    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    switch (typeof dwellingCov) {
      case HODW_LossSettlementWindstorm_HOE_Ext:
          rateACVLossSettlementOnRoofSurfacing(dwellingCov, dateRange)
          break
      case HODW_OrdinanceCov_HOE:
          rateOrdinanceOrLawCoverage(dwellingCov, dateRange)
          break
      case HODW_Personal_Property_HOE:
          ratePersonalPropertyReplacementCost(dwellingCov, dateRange)
          break

    }
  }

  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
    var dwelling = PolicyLine.Dwelling
    _discountsOrSurchargeRatingInfo = new HOGroup2DiscountsOrSurchargeRatingInfo(PolicyLine, _hoRatingInfo.AdjustedBaseClassPremium)
    if (dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT){
      rateSuperiorConstructionDiscount(dateRange)
    }
    if (dwelling.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3){
      rateAgeOfHomeDiscount(dateRange)
    }
    if (dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEAS || dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC){
      rateSeasonalOrSecondaryResidenceSurcharge(dateRange)
    }



    updateTotalBasePremium()
  }

  /**
   * Function which rates the Personal property replacement cost
   */
  function ratePersonalPropertyReplacementCost(dwellingCov: DwellingCov_HOE  , dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: ratePersonalPropertyReplacementCost", this.IntrinsicType)
/*    var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState.Code)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.HO_REPLACEMENT_COST_PERSONAL_PROPERTY_RATE_ROUTINE, HOCostType_Ext.TC_REPLACEMENTCOSTONPERSONALPROPERTY, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    if (costData != null)
      addCost(costData)*/
    _logger.debug("Personal Property Replacement Cost Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate the Ordinance Or Law Coverage
   */
  function rateOrdinanceOrLawCoverage(dwellingCov: HODW_OrdinanceCov_HOE, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateOrdinanceOrLawCoverage to rate Ordinance Or Law Coverage", this.IntrinsicType)
      //TODO Update once typekeys are used
      if (dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.DisplayValue == "25%"){
        var dwellingRatingInfo = new HOGroup2DwellingRatingInfo(dwellingCov)
        dwellingRatingInfo.TotalBasePremium = _hoRatingInfo.TotalBasePremium
        var rateRoutineParameterMap = getHOParameterSet(PolicyLine, PolicyLine.BaseState, dwellingRatingInfo)
        var costData = HOCreateCostDataUtil.createCostDataForDwellingCoverage(dwellingCov, dateRange, HORateRoutineNames.ORDINANCE_OR_LAW_COV_ROUTINE_NAME, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
        if (costData != null)
          addCost(costData)
    }
    _logger.debug("Ordinance Or Law Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
   * Rate ACV loss settlement on Roof surfacing for HO3 policy types
   */
  function rateACVLossSettlementOnRoofSurfacing(dwellingCov: HODW_LossSettlementWindstorm_HOE_Ext, dateRange: DateRange) {
    _logger.debug("Entering " + CLASS_NAME + ":: rateACVLossSettlementOnRoofSurfacing to rate ACV loss settlement on roof surfacing", this.IntrinsicType)
    var costData = HOCommonRateRoutinesExecutor.rateACVLossSettlementOnRoofSurfacing(dwellingCov, dateRange, PolicyLine, Executor, RateCache, this.NumDaysInCoverageRatedTerm,_hoRatingInfo)
    if (costData != null)
      addCost(costData)
    _logger.debug("ACV loss settlement on Roof Surfacing Rated Successfully", this.IntrinsicType)
  }
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
  private function getDwellingCovParameterSet(line: PolicyLine, dwellingRatingInfo: HOGroup2DwellingRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo
    }
  }

  private function getParameterSet(line: PolicyLine, dwellingRatingInfo: HOGroup2DwellingRatingInfo, stateCode: String,discountOrSurchargeRatingInfo: HOGroup2DiscountsOrSurchargeRatingInfo,lineRatingInfo: HOGroup1LineRatingInfo): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_DWELLINGRATINGINFO_EXT -> dwellingRatingInfo,
        TC_DISCOUNTORSURCHARGERATINGINFO_EXT -> discountOrSurchargeRatingInfo,
        TC_LINERATINGINFO_EXT -> lineRatingInfo

    }

  }

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
   *  Returns the parameter set for the line level coverages
   */
  private function getLineCovParameterSet(line: PolicyLine, lineRatingInfo: HOGroup1LineRatingInfo, stateCode: String): Map<CalcRoutineParamName, Object> {
    return {
        TC_POLICYLINE -> line,
        TC_STATE -> stateCode,
        TC_LINERATINGINFO_EXT -> lineRatingInfo
    }
  }
  private function updateTotalBasePremium() {
    _hoRatingInfo.TotalBasePremium = (_hoRatingInfo.AdjustedBaseClassPremium + _hoRatingInfo.AgeOfHomeDiscount + _hoRatingInfo.SuperiorConstructionDiscount
        + _hoRatingInfo.SeasonalSecondaryResidenceSurcharge

    )
  }
}