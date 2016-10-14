package una.rating.plugin

uses gw.api.domain.financials.PCFinancialsLogger
uses gw.api.profiler.PCProfilerTag
uses gw.api.system.PCDependenciesGateway
uses gw.plugin.InitializablePlugin
uses gw.plugin.policyperiod.IRatingPlugin
uses gw.rating.AbstractRatingEngine
uses una.logging.UnaLoggerCategory

uses java.lang.IllegalArgumentException
uses java.util.Map

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:32 AM
 * This is the custom UNA rating plugin implementation which rates the policy period. This rating plugin creates a
 * rating engine for each line of business and rates it accordingly.
 */
class UNARatingPlugin implements IRatingPlugin, InitializablePlugin {
  public static final var MINIMUM_RATING_LEVEL: String = "RatingLevel"
  final static var _logger = UnaLoggerCategory.UNA_RATING
  var _minimumRateBookStatus: RateBookStatus
  override function ratePeriod(period: PolicyPeriod) {
    ratePeriod(period, null)
  }

  override function ratePeriod(period: PolicyPeriod, rStyle: RatingStyle) {
    var logMsg = displaykey.PolicyPeriod.Quote.Requesting.Synchronously(period)
    _logger.info(logMsg)
    PCFinancialsLogger.logInfo(logMsg)
    ratePeriodImpl(period, rStyle)
    PCFinancialsLogger.logInfo(displaykey.PolicyPeriod.Quote.Requesting.Done(period))
    _logger.info(displaykey.PolicyPeriod.Quote.Requesting.Done(period))
  }

  private function ratePeriodImpl(period: PolicyPeriod, rStyle: RatingStyle) {
    PCProfilerTag.RATE_PERIOD.execute(\-> {

      var logMsg = "Rating ${period.Job.DisplayType} #${period.Job.JobNumber}"
          + " for Policy # ${period.PolicyNumber},"
          + " Branch Name = [${period.BranchName}]"
          + " with Edit Effective Date of ${period.EditEffectiveDate} ..."

      PCFinancialsLogger.logInfo(logMsg)
      _logger.info(logMsg)
      for (line in period.RepresentativePolicyLines) {
        PCProfilerTag.RATE_LINE.execute(\-> {
          var ratingEngine = createRatingEngine(line)
          ratingEngine.rate()
        })
      }
      period.markValidQuote()
      PCFinancialsLogger.logInfo(logMsg + " done")
      _logger.info(logMsg + " done")
    })
  }

  override function setParameters(params: Map) {
    var minimumLevel = params.get(MINIMUM_RATING_LEVEL) as String

    if (!RateBookStatus.getTypeKeys(true).hasMatch(\key -> key.Code == minimumLevel)){
      throw new IllegalArgumentException(displaykey.Web.Rating.Errors.InvalidRatingLevel(minimumLevel))
    }

    _minimumRateBookStatus = RateBookStatus.get(minimumLevel)
    if (!una.utils.EnvironmentUtil.isQAT()){
      if (PCDependenciesGateway.ServerMode.Production && _minimumRateBookStatus != TC_ACTIVE){
        throw new IllegalArgumentException(displaykey.Web.Rating.Errors.InvalidRatingLevel.ForProduction(_minimumRateBookStatus, RateBookStatus.TC_ACTIVE))
      }
    }
  }

  protected function createRatingEngine(line: PolicyLine): AbstractRatingEngine {
    var ratingEngine = line.createRatingEngine(RateMethod.TC_RATEFLOW, {RateEngineParameter.TC_RATEBOOKSTATUS -> _minimumRateBookStatus})
    if (ratingEngine == null){
      ratingEngine = line.createRatingEngine(RateMethod.TC_SYSTABLE, null)
    }
    return ratingEngine
  }
}