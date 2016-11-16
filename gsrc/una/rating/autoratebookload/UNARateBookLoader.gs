package una.rating.autoratebookload

uses una.logging.UnaLoggerCategory
uses una.utils.EnvironmentUtil

uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 7/5/16
 * This is the custom UNA Rate book loader which calls and implements the Automatic rate book loader accelerator in preload
 */
class UNARateBookLoader {
  private static var _logger = UnaLoggerCategory.UNA_RATING
  construct() {
  }

  /**
   * static function which is called in the preload.txt to load the rate tables
   */
  public static function loadRateBooksFromPreload() {
    try {
      loadRateBooks()
    } catch (ex: Exception) {
      _logger.error("Exception in Automatic rate book loader '${ex}' ")
    }
  }

  /**
   *  Function which calls the Automatic rate book loader accelerator to load the rate books
   */
  private static function loadRateBooks() {
    try {
      if ((ScriptParameters.AutomaticallyLoadRateBooks)and !(EnvironmentUtil.isProduction())) {
        gw.transaction.Transaction.runWithNewBundle(\bundle -> {
          var rateBookLoader = new ProductionAutomaticRateBookLoader(_logger)
          rateBookLoader.run()
        }, "su")
      } else {
        _logger.info("Automatic rate book loader is not enabled for '${EnvironmentUtil.PolicyCenterRuntime}' environment.")
      }
    } catch (ex: Exception) {
      _logger.error("Exception in Automatic rate book loader '${ex}' ")
    }
  }
}