package una.rating.ho.common

uses gw.rating.AbstractRatingEngine
uses java.lang.Iterable
uses gw.rating.CostData
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.DwellingCovCostData_HOE
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
uses gw.lob.ho.rating.HOTaxCostData_HOE

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

  override protected function rateWindow(line: HomeownersLine_HOE) {
    assertSliceMode(line)
    // we need to be in slice mode to create costs, but we're creating costs for the whole window
    if(isFIGASurchargeApplicable()){
      rateFIGASurcharge(line)
    }
    //rate policyFee
    if (isPolicyFeeApplicable(line)){
      ratePolicyFee(line)
    }

    if(isEMPASurchargeApplicable()){
      rateEMPASurcharge(line)
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
        if (cost.HOCostType == HOCostType_Ext.TC_ADDITIONALPREMIUMWAIVED)
          continue
      }
      if(cost typeis HOTaxCost_HOE)
        continue
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
      case HOTaxCost_HOE:
          cd = new HOTaxCostData_HOE(c, RateCache)
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
    var totalPremium : BigDecimal = 0.0
    if(BaseState == Jurisdiction.TC_FL){
      for(costData in CostDatas){
        if(costData typeis DwellingCovCostData_HOE and !(costData typeis ScheduleCovCostData_HOE)){
          var cost = costData.getExistingCost(PolicyLine)
          if(cost.Coverage.PatternCode == "HODW_FloodCoverage_HOE_Ext")
            continue
        }
        totalPremium += costData?.ActualTermAmount
      }
    } else{
      totalPremium = CostDatas.sum(\costData -> costData.ActualTermAmount)
    }
    var minimumPremium = 0
    var filter = new RateBookQueryFilter(PolicyLine.Branch.PeriodStart, PolicyLine.Branch.PeriodEnd, PolicyLine.PatternCode)
        {: Jurisdiction = BaseState,
            : MinimumRatingLevel = MinimumRatingLevel,
            : RenewalJob = (PolicyLine.Branch.JobProcess typeis RenewalProcess),
            : Offering = OfferingCode}
    var params = {BaseState.Code, PolicyLine.HOPolicyType.Code}
    minimumPremium = new RatingQueryFacade().getFactor(filter, "ho_minimum_premium_cost_cw", params).Factor
    if (minimumPremium > totalPremium){
      if(_logger.isDebugEnabled())
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
      if(_logger.isDebugEnabled())
        _logger.debug("Minimum Premium Adjustment added Successfully", this.IntrinsicType)
    }
  }

  /**
  * Adjusting the total discount if it exceeds the maximum discount of a particular state
   */
  function rateMaximumDiscountAdjustment(dateRange : DateRange, totalDiscountAmount : BigDecimal, basePremium : BigDecimal) : BigDecimal{
    if(_logger.isDebugEnabled())
      _logger.debug("Entering :: rateMaximumDiscountAdjustment:", this.IntrinsicType)
    var discountAdjustment : BigDecimal = 0
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> _baseState.Code,
        TC_TOTALDISCOUNTAMOUNT -> totalDiscountAmount,
        TC_BASEPREMIUM -> basePremium
    }
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.MAXIMUM_DISCOUNT_ADJUSTMENT_RATE_ROUTINE, HOCostType_Ext.TC_MAXIMUMDISCOUNTADJUSTMENT, RateCache, PolicyLine, rateRoutineParameterMap, Executor, PolicyLine.Branch.NumDaysInPeriod)
    if (costData != null){
      discountAdjustment = costData.ActualTermAmount
      addCost(costData)
    }
    if(_logger.isDebugEnabled())
      _logger.debug("Discount Adjustment Done Successfully", this.IntrinsicType)
    return discountAdjustment
  }

  /**
   * Rate the Policy fee
   */
  function ratePolicyFee(line: HomeownersLine_HOE) {
    if(_logger.isDebugEnabled())
      _logger.debug("Entering :: ratePolicyFee:", this.IntrinsicType)
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> _baseState.Code
    }
    var costData : CostData
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    if(_baseState == Jurisdiction.TC_NC and PolicyLine.HOPolicyType == HOPolicyType_HOE.TC_LPP_EXT)
      costData = HOCreateCostDataUtil.createCostDataForTaxCosts(dateRange, HORateRoutineNames.LPP_POLICY_FEE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, line.Branch.NumDaysInPeriod, ChargePattern.TC_POLICYFEES_EXT)
    else
      costData = HOCreateCostDataUtil.createCostDataForTaxCosts(dateRange, HORateRoutineNames.POLICY_FEE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, line.Branch.NumDaysInPeriod, ChargePattern.TC_POLICYFEES_EXT)
    if (costData != null and costData.ActualTermAmount != 0){
      costData.ActualAmount = costData.ActualTermAmount
      addCost(costData)
    }
    if(_logger.isDebugEnabled())
      _logger.debug("Policy fee added Successfully", this.IntrinsicType)
  }

  /**
   * Rate the FIGA Surcharge
   */
  function rateFIGASurcharge(line: HomeownersLine_HOE) {
    if(_logger.isDebugEnabled())
      _logger.debug("Entering :: rateFIGASurcharge:", this.IntrinsicType)
    var totalPolicyPremium = CostDatas.sum(\costData -> costData.ActualTermAmount)
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_TOTALPOLICYPREMIUM_EXT -> totalPolicyPremium
    }
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = HOCreateCostDataUtil.createCostDataForTaxCosts(dateRange, HORateRoutineNames.FIGA_SURCHARGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, line.Branch.NumDaysInPeriod, ChargePattern.TC_FIGASURCHARGE_EXT)
    if (costData != null){
      costData.ActualAmount = costData.ActualTermAmount
      addCost(costData)
    }
    if(_logger.isDebugEnabled())
      _logger.debug("FIGA surcharge added Successfully", this.IntrinsicType)
  }

  /**
   * Rate the EMPA Surcharge
   */
  function rateEMPASurcharge(line: HomeownersLine_HOE) {
    if(_logger.isDebugEnabled())
      _logger.debug("Entering :: rateEMPASurcharge:", this.IntrinsicType)
    var totalPolicyPremium = CostDatas.sum(\costData -> costData.ActualTermAmount)
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> _baseState.Code
    }
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = HOCreateCostDataUtil.createCostDataForTaxCosts(dateRange, HORateRoutineNames.EMPA_SURCHARGE_RATE_ROUTINE, RateCache, PolicyLine, rateRoutineParameterMap, Executor, line.Branch.NumDaysInPeriod, ChargePattern.TC_EMPASURCHARGE_EXT)
    if (costData != null){
      costData.ActualAmount = costData.ActualTermAmount
      addCost(costData)
    }
    if(_logger.isDebugEnabled())
      _logger.debug("EMPA surcharge added Successfully", this.IntrinsicType)
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
    } else if (_baseState == typekey.Jurisdiction.TC_TX or _baseState == typekey.Jurisdiction.TC_CA or  _baseState == typekey.Jurisdiction.TC_FL or _baseState == typekey.Jurisdiction.TC_NC) {
      if (line.Branch.Job.Subtype != typekey.Job.TC_POLICYCHANGE and line.Branch.Job.Subtype != typekey.Job.TC_CANCELLATION)
        return true
    } else if (_baseState == typekey.Jurisdiction.TC_NV){
      if (line.Branch.Job.Subtype == typekey.Job.TC_SUBMISSION)
        return true
    }
    return false
  }

  private function isFIGASurchargeApplicable() : boolean{
    if(_baseState == typekey.Jurisdiction.TC_FL){
      if (PolicyLine.Branch.Job.Subtype == typekey.Job.TC_SUBMISSION || PolicyLine.Branch.Job.Subtype == typekey.Job.TC_RENEWAL)
        return true
    }
    return false
  }

  private function isEMPASurchargeApplicable() : boolean{
    if(_baseState == typekey.Jurisdiction.TC_FL){
      if (PolicyLine.Branch.Job.Subtype == typekey.Job.TC_SUBMISSION)
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