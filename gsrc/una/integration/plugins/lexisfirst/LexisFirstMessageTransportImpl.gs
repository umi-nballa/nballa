package una.integration.plugins.lexisfirst

uses una.logging.UnaLoggerCategory
uses gw.plugin.messaging.MessageTransport
uses una.integration.Helper.LexisFirstOutBoundHelper
uses java.lang.Exception

/**
 * Created for Lexis First Messaging Transport
 * User: pavan Theegala
 * Date: 12/22/16
 *
 */
class LexisFirstMessageTransportImpl implements MessageTransport {
  final static  var _logger = UnaLoggerCategory.INTEGRATION
  private static final var CLASS_NAME = LexisFirstMessageTransportImpl.Type.DisplayName
  public final static var DEST_ID: int = 90
  public static final var CREATEPERIOD_LEXIS_FIRST_MSG: String = "LexisFirstOnCreatePeriod"
  public static final var ISSUEPERIOD_LEXIS_FIRST_MSG: String = "LexisFirstOnIssuePeriod"
  public static final var CHANGEPERIOD_LEXIS_FIRST_MSG: String = "LexisFirstOnChangePeriod"
  public static final var REINSTATEPERIOD_LEXIS_FIRST_MSG: String = "LexisFirstOnReinstatePeriod"
  public static final var RENEWPERIOD_LEXIS_FIRST_MSG: String = "LexisFirstOnRenewPeriod"
  override function send(message: Message, payLoad: String) {
    _logger.info(" Entering  " + CLASS_NAME + " :: " + "" + "For LexisFirst Message Transport  ")
    try {
      var lexisFirstOutBoundHelper = new LexisFirstOutBoundHelper()
      lexisFirstOutBoundHelper.createLexisFirstTransaction(message)
      message.reportAck()
      _logger.info(" Leaving  " + CLASS_NAME + " :: " + "" + "For LexisFirst  Message Transport  ")
    } catch (exp: Exception) {
      _logger.error("Lexis First Messaging Error", exp)
      message.ErrorDescription = exp.Message
    }
  }

  override function shutdown() {
  }

  override function suspend() {
  }

  override function resume() {
  }

  override function setDestinationID(p0: int) {
  }
}