package una.integration.service.transport.tuna

uses una.logging.UnaLoggerCategory
uses gw.xml.XmlElement
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel
uses una.integration.service.transport.mock.TunaMockPayloadGenerator
uses java.lang.Exception

/**
 * User: pyerrumsetty
 * Purpose: To provide stubbed implementation of TunaCommunicator for testing purposes.
 */
class TunaCommunicatorStub  {

  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = TunaCommunicator.Type.DisplayName
  var mockPayload : TunaMockPayloadGenerator

  construct(){
    mockPayload = new TunaMockPayloadGenerator()

   }



  function getPropertyInformationScrubOnly(): XmlElement {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformationScrubOnly" + "For Address Validation ", this.IntrinsicType)
      var res = mockPayload.GetPropertyInformationScrubOnly()
      res.print()
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformationScrubOnly" + "For Address Validation ", this.IntrinsicType)
      return res
     } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " getPropertyInformationScrubOnly " + " : StackTrace = " + exp)
      throw exp
    }
  }
}