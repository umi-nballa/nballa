package una.integration.service.transport.clue

uses gw.api.system.logging.LoggerFactory
uses gw.api.util.DisplayableException
uses gw.pl.logging.LoggerCategory
uses gw.xml.ws.WebServiceException
uses wsi.remote.una.ncfwsc.guidewire.InteractiveOrderHandler
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: JGupta
 * Date: 10/17/16
 * Time: 6:10 AM
 * To change this template use File | Settings | File Templates.
 */
class CluePropertyCommunicatorStub {
  static var _logger = LoggerFactory.getLogger(LoggerCategory.PLUGIN, "CluePropertyCommunicator")
  /**
   *  Function to invoke Clue Property Service and return Claim History
   */
  @Param("orderXml", "Request xml for Clue as String is passed")
  @Throws(DisplayableException, "If the web service is not available")
  function invokeCluePropertyService(orderXml: String): String {
    try {
      var clueAPI = new InteractiveOrderHandler()
      var result = clueAPI.handleInteractiveOrder(orderXml)
      return result
    }
        catch (e: Exception) {
          _logger.error("CluePropertyCommunicatorStub.gs - Exception occured "+e)
          return null
        }
  }
}