package una.rating.autoratebookload

uses gw.api.system.PCLoggerCategory
uses gw.plugin.policyperiod.impl.PCRatingPlugin
uses java.util.Map

class AutoLoadRatingPlugin extends PCRatingPlugin {

  private static final var _rfLogger = PCLoggerCategory.RATEFLOW

  var _autoLoadHelper : RatingPluginAutomaticRateBookLoadHelper

  override function setParameters(params : Map<Object, Object>) {
    super.setParameters(params)

    var levelKey = params.get(MINIMAL_RATING_LEVEL)
    var defaultMinimumBookStatusLevel = RateBookStatus.get(levelKey as String)

    _autoLoadHelper = new RatingPluginAutomaticRateBookLoadHelper(params, defaultMinimumBookStatusLevel, _rfLogger)
  }

  override function ratePeriodImpl(period : PolicyPeriod, rStyle : RatingStyle) {
    _autoLoadHelper.maybeDoAutomaticRateBookLoad()
    super.ratePeriodImpl(period, rStyle)
  }
}
