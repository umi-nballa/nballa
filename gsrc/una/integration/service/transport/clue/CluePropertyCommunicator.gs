package una.integration.service.transport.clue

uses gw.api.system.logging.LoggerFactory
uses gw.api.util.DisplayableException
uses gw.pl.logging.LoggerCategory
uses gw.xml.ws.WebServiceException
uses wsi.remote.una.ncfwsc.guidewire.InteractiveOrderHandler

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 10/17/16
 * Time: 6:10 AM
 * To change this template use File | Settings | File Templates.
 */
class CluePropertyCommunicator {
  private final static var WS_NOT_AVAILABLE: String = "Failed to connect to the LexisNexis web service."
  /**
   *  Function to invoke Clue Property Service and return Result Claim History
   */
  static var _logger = LoggerFactory.getLogger(LoggerCategory.PLUGIN, "CluePropertyCommunicator")
  @Param("orderXml", "Request xml for Clue as String is passed")
  @Throws(DisplayableException, "If the web service is not available")
  function invokeCluePropertyService(orderXml: String): String {
    try {
      var clueAPI = new InteractiveOrderHandler()
      _logger.info(orderXml)
      var result = clueAPI.handleInteractiveOrder(orderXml)
      return result
    }
        catch (wse: WebServiceException) {
          _logger.error("CluePropertyCommunicator.gs - Exception occured "+wse)
          throw new DisplayableException(WS_NOT_AVAILABLE, wse)
        }
  }
}