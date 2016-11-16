package una.rating.ho.common

uses gw.rating.AbstractRatingEngine
uses java.lang.Iterable
uses java.util.List
uses gw.rating.CostData
uses gw.rating.CostData
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses java.util.Map
uses java.util.Map
uses una.logging.UnaLoggerCategory
uses gw.lob.common.util.DateRange
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses gw.lob.ho.rating.ScheduleCovCostData_HOE
uses gw.lob.ho.rating.ScheduleLineCovCostData_HOE_Ext
uses gw.financials.PolicyPeriodFXRateCache
uses gw.rating.rtm.query.RateBookQueryFilter
uses gw.job.RenewalProcess
uses gw.rating.rtm.query.RatingQueryFacade
uses una.rating.util.HOCreateCostDataUtil
uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:32 AM
 * This is the custom UNA implementation which initializes the rating engine and sets the rate book status
 */
class UNAHORatingEngine_HOE<L extends HomeownersLine_HOE> extends AbstractRatingEngine<HomeownersLine_HOE> {
  var _minimumRatingLevel: RateBookStatus as MinimumRatingLevel
  var _baseState: Jurisdiction as BaseState
  var _offeringCode: String as OfferingCode
  var _executor: HORateRoutineExecutor as Executor
  final static var _logger = UnaLoggerCategory.UNA_RATING
  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line)
    _baseState = line.BaseState
    _minimumRatingLevel = minimumRatingLevel
    _logger.info("Initializing the " + _baseState.Code + " HO Rating Engine")
    var offering = PolicyLine.Branch.Offering
    if (offering != null){
      this.OfferingCode = offering.Code
    }
    this.Executor = new HORateRoutineExecutor(ReferenceDatePlugin, PolicyLine, _minimumRatingLevel, _offeringCode)
    _logger.info(_baseState.Code + " HO Rating Engine initialized")
  }

  override protected function rateSlice(lineVersion: HomeownersLine_HOE) {
    assertSliceMode(lineVersion)

    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))

      if (_baseState == typekey.Jurisdiction.TC_TX || _baseState == typekey.Jurisdiction.TC_AZ || _baseState == typekey.Jurisdiction.TC_CA
          || _baseState == typekey.Jurisdiction.TC_NV || _baseState == typekey.Jurisdiction.TC_SC ||
          _baseState == typekey.Jurisdiction.TC_FL){
        //rate base premium
        rateHOBasePremium(lineVersion.Dwelling, RateCache, sliceRange)

        //rate Discounts and Credits
        _logger.info("Rating Discounts and Surcharges")
        rateHOLineCosts(sliceRange)
        _logger.info("Discounts and Surcharges rating done")

        //rate line level coverages
        _logger.info("Rating Line Level HO Coverages")
        var covs = lineVersion.CoveragesFromCoverable.where( \ elt -> lineVersion.hasCoverageConditionOrExclusion(elt.PatternCode))
        covs.each( \ elt -> rateLineCoverages(elt as HomeownersLineCov_HOE, sliceRange ))
        _logger.info("Done rating Line Level HO Coverages")

        //rate dwelling level coverages
        _logger.info("Rating Dwelling Level HO Coverages")
        if (lineVersion.Dwelling != null){
          var existingCov =  lineVersion.Dwelling.CoveragesFromCoverable.where( \ elt -> lineVersion.Dwelling.hasCoverageConditionOrExclusion(elt.PatternCode) )
          existingCov.each( \ elt -> rateDwellingCoverages(elt  as DwellingCov_HOE, sliceRange))
        }
        _logger.info("Done rating Dwelling Level HO Coverages")

        //Add the minimum premium adjustment, if the total premium is less than minimum premium
        rateManualPremiumAdjustment(sliceRange)
      }
    }
  }

  override protected function rateWindow(line: HomeownersLine_HOE) {
    assertSliceMode(line)
    // we need to be in slice mode to create costs, but we're creating costs for the whole window
    //rate policyFee
    if (isPolicyFeeApplicable(line)){
      ratePolicyFee(line)
    }
    if (_baseState == typekey.Jurisdiction.TC_TX and line.Branch.Job.Subtype == typekey.Job.TC_POLICYCHANGE){
      waiveAdditionalPremiumForPolicyChangeTX(line)
    }
  }

  override protected function existingSliceModeCosts(): Iterable<Cost> {
    var costs = PolicyLine.Costs
    var costsWithNoWindowCosts: List<Cost> = new List<Cost>()
    for (cost in costs) {
      if (cost typeis HomeownersLineCost_EXT){
        if (cost.HOCostType == HOCostType_Ext.TC_POLICYFEE or cost.HOCostType == HOCostType_Ext.TC_ADDITIONALPREMIUMWAIVED)
          continue
      }
      costsWithNoWindowCosts.add(cost)
    }
    return costsWithNoWindowCosts
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch (typeof c) {
      case HomeownersBaseCost_HOE:
          cd = new HomeownersBaseCostData_HOE(c, RateCache)
          break
      case HomeownersCovCost_HOE:
          cd = new HomeownersCovCostData_HOE(c, RateCache)
          break
      case DwellingCovCost_HOE:
          cd = new DwellingCovCostData_HOE(c, RateCache)
          break
      case HomeownersLineCost_EXT:
          cd = new HomeownersLineCostData_HOE(c, RateCache)
          break
      case ScheduleCovCost_HOE:
          cd = new ScheduleCovCostData_HOE(c, RateCache)
          break
      case ScheduleLineCovCost_HOE_Ext:
          cd = new ScheduleLineCovCostData_HOE_Ext(c, RateCache)
          break
        default:
        throw "unknown type of cost " + typeof c
    }
    return cd
  }

  /**
   * Rate the line level coverages
   */
  function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
  }

  /**
   * Rate the Dwelling level coverages
   */
  function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
  }

  /**
   * Rate the base premium for HO
   */
  function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
  }

  /**
   * Rate the discounts and Surcharges
   */
  function rateHOLineCosts(dateRange: DateRange) {
  }

  /**
   * Rate the manual premium Adjustment
   */
  function rateManualPremiumAdjustment(dateRange: DateRange) {
    var totalPremium = CostDatas.sum(\costData -> costData.ActualTermAmount)
    var minimumPremium = 0
    var filter = new RateBookQueryFilter(PolicyLine.Branch.PeriodStart, PolicyLine.Branch.PeriodEnd, PolicyLine.PatternCode)
        {: Jurisdiction = BaseState,
            : MinimumRatingLevel = MinimumRatingLevel,
            : RenewalJob = (PolicyLine.Branch.JobProcess typeis RenewalProcess),
            : Offering = OfferingCode}
    var params = {BaseState.Code, PolicyLine.HOPolicyType.Code}
    minimumPremium = new RatingQueryFacade().getFactor(filter, "ho_minimum_premium_cost_cw", params).Factor
    if (minimumPremium > totalPremium){
      _logger.debug("Entering :: rateManualPremiumAdjustment:", this.IntrinsicType)
      var premiumAdjustment = (minimumPremium - totalPremium)
      var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
          TC_POLICYLINE -> PolicyLine,
          TC_MINIMUMPREMIUMADJUSTMENT_EXT -> premiumAdjustment
      }
      var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.MINIMUM_PREMIUM_ADJUSTMENT_RATE_ROUTINE, HOCostType_Ext.TC_MINIMUMPREMIUMADJUSTMENT, RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
      costData.ProrationMethod = typekey.ProrationMethod.TC_FLAT
      if (costData != null)
        addCost(costData)
      _logger.debug("Minimum Premium Adjustment added Successfully", this.IntrinsicType)
    }
  }

  /**
   * Rate the Policy fee
   */
  function ratePolicyFee(line: HomeownersLine_HOE) {
    _logger.debug("Entering :: ratePolicyFee:", this.IntrinsicType)
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> _baseState.Code
    }
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.POLICY_FEE_RATE_ROUTINE, HOCostType_Ext.TC_POLICYFEE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, line.Branch.NumDaysInPeriod)
    if (costData != null and costData.ActualTermAmount != 0){
      costData.ActualAmount = costData.ActualTermAmount
      addCost(costData)
    }
    _logger.debug("Policy fee added Successfully", this.IntrinsicType)
  }

  /**
   *  Additional or Return Premiums of $5. or less which arise from a Policy Change
   *  shall be WAIVED (unless requested by Insured).
   */
  function waiveAdditionalPremiumForPolicyChangeTX(line: HomeownersLine_HOE) {
    var totalPremium = CostDatas.sum(\costData -> costData.ActualTermAmount)
    //since we don't add the policy fee for the policy change in the rate window, we add it manually here
    totalPremium += getPolicyFeeForState()
    var totalPremiumBeforePolicyChange: java.math.BigDecimal = 0
    var policyPeriod = line.Dwelling?.PolicyPeriod.Policy.LatestBoundPeriod
    totalPremiumBeforePolicyChange = policyPeriod.TotalPremiumRPT.Amount
    var totalPremiumChange = totalPremium - totalPremiumBeforePolicyChange
    if (totalPremiumChange >= - 5 and totalPremiumChange < 0){
      var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
      var costData = new HomeownersLineCostData_HOE(dateRange.start, dateRange.end, PolicyLine.PreferredCoverageCurrency, RateCache, typekey.HOCostType_Ext.TC_ADDITIONALPREMIUMWAIVED)
      costData.init(PolicyLine)
      costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
      costData.StandardBaseRate = totalPremiumChange
      costData.StandardAdjRate = totalPremiumChange
      costData.StandardTermAmount = totalPremiumChange
      costData.copyStandardColumnsToActualColumns()
      addCost(costData)
    }
  }

  /**
   *  Function which determines whether policy fee is applicable or not.
   */
  private function isPolicyFeeApplicable(line: HomeownersLine_HOE): boolean {
    if (_baseState == typekey.Jurisdiction.TC_AZ and  _baseState == typekey.Jurisdiction.TC_SC) {
      return false
    } else if (_baseState == typekey.Jurisdiction.TC_TX or _baseState == typekey.Jurisdiction.TC_CA or  _baseState == typekey.Jurisdiction.TC_FL) {
      if (line.Branch.Job.Subtype != typekey.Job.TC_POLICYCHANGE and line.Branch.Job.Subtype != typekey.Job.TC_CANCELLATION)
        return true
    } else if (_baseState == typekey.Jurisdiction.TC_NV){
      if (line.Branch.Job.Subtype == typekey.Job.TC_SUBMISSION)
        return true
    }
    return false
  }

  private function getPolicyFeeForState(): BigDecimal {
    var filter = new RateBookQueryFilter(PolicyLine.Branch.PeriodStart, PolicyLine.Branch.PeriodEnd, PolicyLine.PatternCode)
        {: Jurisdiction = BaseState,
            : MinimumRatingLevel = MinimumRatingLevel,
            : RenewalJob = (PolicyLine.Branch.JobProcess typeis RenewalProcess),
            : Offering = OfferingCode}
    var params = {BaseState.Code}
    var policyFee = new RatingQueryFacade().getFactor(filter, "ho_policy_fee_cw", params).Factor
    return policyFee as BigDecimal
  }
}