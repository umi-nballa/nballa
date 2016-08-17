package una.rating.ho

uses gw.rating.AbstractRatingEngine
uses java.lang.Iterable
uses gw.rating.CostData
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.DwellingCovCostData_HOE
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses java.util.Map
uses una.rating.util.HOCreateCostDataUtil
uses una.rating.ho.common.HORateRoutineNames
uses una.rating.ho.common.HORateRoutineExecutor
uses una.rating.ho.common.HomeownersLineCostData_HOE

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:32 AM
 * This is the custom UNA implementation which initializes the rating engine and sets the rate book status
 */

class UNAHORatingEngine_HOE<L extends HomeownersLine_HOE> extends AbstractRatingEngine<HomeownersLine_HOE> {
  var _minimumRatingLevel: RateBookStatus as MinimumRatingLevel
  var _baseState: Jurisdiction as BaseState
  var _offeringCode : String as OfferingCode
  var _executor: HORateRoutineExecutor as Executor
  final static var _logger = UnaLoggerCategory.UNA_RATING

  construct(line: HomeownersLine_HOE){
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

      if(_baseState == typekey.Jurisdiction.TC_TX || _baseState == typekey.Jurisdiction.TC_AZ || _baseState == typekey.Jurisdiction.TC_CA
         || _baseState == typekey.Jurisdiction.TC_NV){
        //rate base premium
        rateHOBasePremium(lineVersion.Dwelling, RateCache, sliceRange)

        //rate Discounts and Credits
        _logger.info("Rating Discounts and Surcharges")
        rateHOLineCosts(sliceRange)
        _logger.info("Discounts and Surcharges rating done")

        //rate line level coverages
        _logger.info("Rating Line Level HO Coverages")
        lineVersion.HOLineCoverages?.each( \ lineCov -> rateLineCoverages(lineCov, sliceRange))
        _logger.info("Done rating Line Level HO Coverages")

        //rate dwelling level coverages
        _logger.info("Rating Dwelling Level HO Coverages")
        if(lineVersion.Dwelling != null){
          lineVersion.Dwelling.Coverages?.each( \ dwellingCov -> rateDwellingCoverages(dwellingCov, sliceRange))
        }
        _logger.info("Done rating Dwelling Level HO Coverages")

        //Add the minimum premium adjustment, if the total premium is less than minimum premium
        rateManualPremiumAdjustment(sliceRange)

        //rate policyFee
        if(((lineVersion.Branch.Job.Subtype == typekey.Job.TC_SUBMISSION) or
           (lineVersion.Branch.Job.Subtype == typekey.Job.TC_RENEWAL and lineVersion.BaseState != typekey.Jurisdiction.TC_NV)) and
           (lineVersion.BaseState != typekey.Jurisdiction.TC_AZ) and (lineVersion.BaseState != typekey.Jurisdiction.TC_CA)){
          ratePolicyFee(sliceRange)
        }
      }
    }
  }

  override protected function rateWindow(line: HomeownersLine_HOE) {
  }

  override protected function existingSliceModeCosts(): Iterable<Cost> {
    return PolicyLine.Costs.where(\c -> c typeis HomeownersCovCost_HOE or
        c typeis DwellingCovCost_HOE)
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch(typeof c){
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
    }
    return cd
  }

  /**
   * Rate the line level coverages
  */
  function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange : DateRange) {  }

  /**
   * Rate the Dwelling level coverages
   */
  function rateDwellingCoverages(dwellingCov : DwellingCov_HOE, dateRange : DateRange) {}

  /**
   * Rate the base premium for HO
   */
  function rateHOBasePremium(dwelling : Dwelling_HOE, rateCache : PolicyPeriodFXRateCache, dateRange : DateRange){}

  /**
   * Rate the discounts and Surcharges
  */
  function rateHOLineCosts(dateRange : DateRange){}

  /**
  * Rate the manual premium Adjustment
   */
  function rateManualPremiumAdjustment(dateRange : DateRange){}

  /**
   * Rate the Policy fee
   */
  function ratePolicyFee(dateRange: DateRange){
    _logger.debug("Entering :: ratePolicyFee:", this.IntrinsicType)
    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_STATE -> _baseState.Code
    }
    var costData = HOCreateCostDataUtil.createCostDataForHOLineCosts(dateRange, HORateRoutineNames.POLICY_FEE_RATE_ROUTINE, HOCostType_Ext.TC_POLICYFEE,RateCache, PolicyLine, rateRoutineParameterMap, Executor, this.NumDaysInCoverageRatedTerm)
    costData.ProrationMethod = typekey.ProrationMethod.TC_FLAT
    if (costData != null)
      addCost(costData)
    _logger.debug("Policy fee added Successfully", this.IntrinsicType)
  }
}