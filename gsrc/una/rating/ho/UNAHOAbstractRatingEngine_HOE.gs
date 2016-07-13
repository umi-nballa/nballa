package una.rating.ho

uses gw.rating.AbstractRatingEngine
uses java.lang.Iterable
uses gw.rating.CostData
uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.lob.ho.rating.HomeownersCovCostData_HOE
uses gw.lob.ho.rating.DwellingCovCostData_HOE

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:32 AM
 * This is the custom UNA implementation which initializes the rating engine and sets the rate book status
 */

abstract class UNAHOAbstractRatingEngine_HOE<L extends HomeownersLine_HOE> extends AbstractRatingEngine<HomeownersLine_HOE> {
  var _minimumRatingLevel: RateBookStatus as MinimumRatingLevel
  var _baseState: Jurisdiction as BaseState
  var _offeringCode: String
  var _executor: HORateRoutineExecutor as Executor
  final static var _logger = UnaLoggerCategory.UNA_RATING

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line)
    _logger.info("Initializing the HO Rating Engine")
    _minimumRatingLevel = minimumRatingLevel
    _baseState = line.BaseState
    var offering = PolicyLine.Branch.Offering
    if (offering != null){
      _offeringCode = offering.Code
    }
    _executor = new HORateRoutineExecutor(ReferenceDatePlugin, PolicyLine, minimumRatingLevel, _offeringCode)
    _logger.info("HO Rating Engine initialized")
  }

  override protected function rateSlice(lineVersion: HomeownersLine_HOE) {
    assertSliceMode(lineVersion)

    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))
      var hoRatingInfo = new HORatingInfo()

      //rate line level coverages
      _logger.info("Rating Line Level HO Coverages")
      for (lineCov in lineVersion.HOLineCoverages) {
        rateLineCoverages(lineCov, sliceRange)
      }
      _logger.info("Done rating Line Level HO Coverages")

      //rate dwelling level coverages
      _logger.info("Rating Dwelling Level HO Coverages")
      if(lineVersion.Dwelling != null){
        //var rater = new HODwellingRater(lineVersion.Dwelling, PolicyLine, _executor, RateCache, hoRatingInfo, BaseState)
        //var costs = rater.ratePremiums(sliceRange, this.NumDaysInCoverageRatedTerm)
        //addCost(costs)
        for (dwellingCov in lineVersion.Dwelling.Coverages) {
          rateDwellingCoverages(dwellingCov, sliceRange, hoRatingInfo)
        }
      }

      _logger.info("Done rating Dwelling Level HO Coverages")
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
      case HomeownersCovCost_HOE:
        cd = new HomeownersCovCostData_HOE(c, RateCache)
        break
      case DwellingCovCost_HOE:
        cd = new DwellingCovCostData_HOE(c, RateCache)
        break
    }
    return cd
  }

  /**
   * Rate the line level coverages
  */
  private function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange : DateRange) {
    switch (typeof lineCov) {
      case HOLI_Med_Pay_HOE:
          rateMedicalPayments(lineCov, dateRange)
          break
      case HOLI_Personal_Liability_HOE:
          ratePersonalLiability(lineCov, dateRange)
          break
    }
  }

  /**
   * Rate the line level coverages
   */
  private function rateDwellingCoverages(dwellingCov : DwellingCov_HOE, dateRange : DateRange, ratingInfo : HORatingInfo) {
    switch(typeof dwellingCov){
      case HODW_EquipBreakdown_HOE_Ext:
        rateEquipmentBreakdownCoverage(dwellingCov, dateRange)
        break
      case HODW_AnimalLiability_HOE_Ext:
        rateAnimalLiabilityCoverage(dwellingCov, dateRange)
        break
      case HODW_SpecificOtherStructure_HOE_Ext:
        rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov, dateRange)
        break
    }
  }

  abstract protected function rateMedicalPayments(lineCov: HOLI_Med_Pay_HOE, dateRange : DateRange)

  abstract protected function ratePersonalLiability(lineCov: HOLI_Personal_Liability_HOE, dateRange : DateRange)

  abstract protected function rateEquipmentBreakdownCoverage(dwellingCov : HODW_EquipBreakdown_HOE_Ext, dateRange : DateRange)

  abstract protected function rateAnimalLiabilityCoverage(dwellingCov : HODW_AnimalLiability_HOE_Ext, dateRange : DateRange)

  abstract protected function rateOtherStructuresIncreasedOrDecreasedLimits(dwellingCov : HODW_SpecificOtherStructure_HOE_Ext, dateRange : DateRange)

}