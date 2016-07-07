package una.rating.autoratebookload

uses org.slf4j.Logger
uses gw.api.system.PCLoggerCategory
uses gw.plugin.policyperiod.impl.PCRatingPlugin
uses java.util.Map

class RatingPluginAutomaticRateBookLoadHelper {

  public static final var AUTOMATICALLY_LOAD_RATE_BOOKS__PARAMETER_NAME : String = "AutomaticallyLoadRateBooks"

  /**
   * Definition: This flag is true if the system (will or) has attempted to automatically load rate books.
   * Specifically, it will NOT change to 'true' if/when the user changes the script parameter to true,
   * as that change won't affect automatic rate book loading until the server restarts. After a restart,
   * the change to the script parameter will take effect, and this flag will reflect it.
   */
  static var _automaticRateBookLoadingIsEnabled : boolean as readonly AutomaticRateBookLoadingIsEnabled = false

  var _rfLogger : Logger
  var _shouldAttemptAutomaticRateBookLoad : boolean

  construct(params : Map<Object, Object>, defaultMinimumBookStatusLevel : RateBookStatus) {
    this(params, defaultMinimumBookStatusLevel, PCLoggerCategory.RATEFLOW)
  }

  construct(params : Map<Object, Object>, defaultMinimumBookStatusLevel : RateBookStatus, loggerToUse : Logger) {
    _rfLogger = loggerToUse

    /**
     * If the rating plugin parameter "AutomaticallyLoadRateBooks" is "true" or "yes" or "1",
     * then we may attempt automatic rate book loading.
     */
    var autoLoadParamValue = params[AUTOMATICALLY_LOAD_RATE_BOOKS__PARAMETER_NAME] as String
    if (autoLoadParamValue != null) {
      autoLoadParamValue = autoLoadParamValue.trim()
    }
    var automaticallyLoadRateBooksParameter = ("true".equalsIgnoreCase(autoLoadParamValue) or "yes".equalsIgnoreCase(autoLoadParamValue) or "1".equalsIgnoreCase(autoLoadParamValue))

    /**
     * We only attempt automatic rate book loading if ALL of the following conditions are met:
     *    1. The AutomaticallyLoadRateBooks bit ScriptParameter is true
     * - AND -
     *    2. The "AutomaticallyLoadRateBooks" rating plugin parameter is "true" or "yes" or "1".
     * - AND -
     *    3. The minimum rate book status level allowed on this machine is DRAFT.
     *
     * (And even after all that, we only attempt it once -- when the first quote is done.)
     */
    _shouldAttemptAutomaticRateBookLoad =
        (   ScriptParameters.AutomaticallyLoadRateBooks
        and automaticallyLoadRateBooksParameter
        and defaultMinimumBookStatusLevel.Priority <= RateBookStatus.TC_DRAFT.Priority)

    _automaticRateBookLoadingIsEnabled = _shouldAttemptAutomaticRateBookLoad

    _rfLogger.info("Rating:  Automatically loading Rate Books is " + (_shouldAttemptAutomaticRateBookLoad ? "ENABLED" : "DISABLED") + ".\n"
        + "   ScriptParameters.AutomaticallyLoadRateBooks = " + ScriptParameters.AutomaticallyLoadRateBooks + "\n"
        + "   autoLoadParamValue = " + autoLoadParamValue + "  (interpreted as " + automaticallyLoadRateBooksParameter + ")\n"
        + "   " + PCRatingPlugin.MINIMAL_RATING_LEVEL + " parameter = " + defaultMinimumBookStatusLevel.Code)
  }

  function maybeDoAutomaticRateBookLoad() {
    // Do this once per server restart -- at the first attempt to quote:
    if (_shouldAttemptAutomaticRateBookLoad) {
      _shouldAttemptAutomaticRateBookLoad = false  // Do this only ONCE, not once per quote. Updates while server is running require a web server restart.
      var rateBookLoader = new ProductionAutomaticRateBookLoader(_rfLogger)
      rateBookLoader.run()
    } else {
      _rfLogger.info("(Skipping AutomaticRateBookLoader Rate Book version check.)")
    }
  }

}
