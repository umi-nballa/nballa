package una.rating.ho.group2

uses gw.lob.common.util.DateRange
uses una.logging.UnaLoggerCategory
uses gw.financials.PolicyPeriodFXRateCache
uses una.rating.ho.group2.ratinginfos.HORatingInfo
uses una.rating.ho.UNAHORatingEngine_HOE

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

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
  }

  /**
   * Rate the line level coverages
   */
  override function rateLineCoverages(lineCov: HomeownersLineCov_HOE, dateRange: DateRange) {
    switch (typeof lineCov) {
    }
  }

  /**
   * Rate the Dwelling level coverages
   */
  override function rateDwellingCoverages(dwellingCov: DwellingCov_HOE, dateRange: DateRange) {
    switch (typeof dwellingCov) {
    }
  }

  /**
   * Function which rates the line level costs and discounts/ surcharges
   */
  override function rateHOLineCosts(dateRange: DateRange) {
  }

  /*private function addWorksheetForCoverage(coverage : EffDated, costData : HOCostData_HOE){
    if(Plugins.get(IRateRoutinePlugin).worksheetsEnabledForLine(PolicyLine.PatternCode)){
      var worksheet = new Worksheet(){ :WorksheetEntries = costData.WorksheetEntries }
      PolicyLine.Branch.addWorksheetFor(coverage, worksheet)
    }
  }*/
}