package una.rating.ho.nc

uses una.rating.ho.common.UNAHORatingEngine_HOE
uses una.logging.UnaLoggerCategory
uses java.util.Map
uses una.rating.ho.nc.ratinginfos.HORatingInfo
uses una.rating.ho.nc.ratinginfos.HONCDiscountsOrSurchargeRatingInfo
uses una.rating.ho.nc.ratinginfos.HONCLineRatingInfo
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.common.util.DateRange

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

  construct(line: HomeownersLine_HOE) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: HomeownersLine_HOE, minimumRatingLevel: RateBookStatus) {
    super(line, minimumRatingLevel)
    _hoRatingInfo = new HORatingInfo()
    _lineRatingInfo = new HONCLineRatingInfo(line)
    _lineRateRoutineParameterMap = getLineCovParameterSet(PolicyLine, _lineRatingInfo, PolicyLine.BaseState)

  }

  /**
   * Rate the base premium for the Group 1 states HO
   */
  override function rateHOBasePremium(dwelling: Dwelling_HOE, rateCache: PolicyPeriodFXRateCache, dateRange: DateRange) {
    var rater = new HOBasePremiumRaterNC(dwelling, PolicyLine, Executor, RateCache, _hoRatingInfo)
    var costs = rater.rateBasePremium(dateRange, this.NumDaysInCoverageRatedTerm)
    addCosts(costs)
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
}