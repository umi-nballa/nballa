package una.integration.service.transport.tuna

uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel
uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformationHeaders
uses wsi.remote.una.tuna.quoteservice.elements.QuoteAuthenticationHeader
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 5/11/16
 * Time: 1:48 PM
 */
class TunaCommunicator {
  var logger = UnaLoggerCategory.UNA_INTEGRATION

  function sendTunaRequest(requestPayload : GetPropertyInformationRequestModel) : PropertyGeographyModel {
    logger.debug(" Sending request to TUNA : TunaCommunicator", this.IntrinsicType)
    var service = new wsi.remote.una.tuna.quoteservice.QuoteService()
    var header = new GetPropertyInformationHeaders()
    var headerQuote = new QuoteAuthenticationHeader()
    headerQuote.Username = "GUIDEWIRE"
    headerQuote.Password = "e7q8$254Xlj9"
    header.QuoteAuthenticationHeader = headerQuote
    var res = service.GetPropertyInformation(requestPayload , header)
    return res
  }

}