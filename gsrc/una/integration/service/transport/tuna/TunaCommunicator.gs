package una.integration.service.transport.tuna

uses una.logging.UnaLoggerCategory
uses una.utils.PropertiesHolder
uses wsi.remote.una.tuna.quoteservice.elements.QuoteAuthenticationHeader
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformation360ValueLookUpOnlyHeaders
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformationCompleteHeaders
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformationGeoLookUpHeaders
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformationHeaders
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformationISOLookUpOnlyHeaders
uses wsi.remote.una.tuna.quoteservice.soapheaders.GetPropertyInformationScrubOnlyHeaders
uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.lang.Exception

/**
 * Class for communicating with tuna services
 * Created  by: pyerrumsetty on 5/14/2016
 *
 */
class TunaCommunicator {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var service = new wsi.remote.una.tuna.quoteservice.QuoteService()

  /**
   *
   * Sending Authenticating details to the service
   */
  private function quoteAuthenticationInformation(): QuoteAuthenticationHeader
  {
    var headerQuote = new QuoteAuthenticationHeader()
    headerQuote.Username = PropertiesHolder.getProperty("TUNA_GATEWAY_USERNAME")
    headerQuote.Password = PropertiesHolder.getProperty("TUNA_GATEWAY_PASSWORD")
    return headerQuote
  }

  /**
   *
   * synchronous event to getPropertyInformationComplete from Tuna WebService
   * @param requestPayload : request xml will be append to the service method
   * @return PropertyGeographyModel : response is available in this object
   */
  function getPropertyInformationComplete(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Sending request to TUNA GetPropertyInformationComplete : TunaCommunicator", this.IntrinsicType)
      var header = new GetPropertyInformationCompleteHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationComplete(requestPayload, header)
      return res
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformationComplete " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   *
   * synchronous event to getPropertyInformation from Tuna WebService
   * @param requestPayload : request xml will be append to the service method
   * @return PropertyGeographyModel : response is available in this object
   */
  function getPropertyInformation(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Sending request to TUNA GetPropertyInformation : TunaCommunicator", this.IntrinsicType)
      var header = new GetPropertyInformationHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformation(requestPayload, header)
      return res
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformation " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   *
   * synchronous event to getPropertyInformationScrubOnly from Tuna WebService
   * @param requestPayload : request xml will be append to the service method
   * @return PropertyGeographyModel : response is available in this object
   */
  function getPropertyInformationScrubOnly(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Sending request to TUNA  GetPropertyInformationScrubOnly: TunaCommunicator", this.IntrinsicType)
      var header = new GetPropertyInformationScrubOnlyHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationScrubOnly(requestPayload, header)
      return res
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformationScrubOnly " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   *
   * synchronous event to getPropertyInformationGeoLookUp from Tuna WebService
   * @param requestPayload : request xml will be append to the service method
   * @return PropertyGeographyModel : response is available in this object
   */
  function getPropertyInformationGeoLookUp(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Sending request to TUNA  GetPropertyInformationGeoLookUp: TunaCommunicator", this.IntrinsicType)
      var header = new GetPropertyInformationGeoLookUpHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationGeoLookUp(requestPayload, header)
      return res
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformationGeoLookUp " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   *
   * synchronous event to getPropertyInformationISOLookUpOnly from Tuna WebService
   * @param requestPayload : request xml will be append to the service method
   * @return PropertyGeographyModel : response is available in this object
   */
  function getPropertyInformationISOLookUpOnly(requestPayload: GetPropertyInformationRequestModel):
      PropertyGeographyModel {
    try {
      logger.debug(" Sending request to TUNA GetPropertyInformationISOLookUpOnly : TunaCommunicator", this.IntrinsicType)
      var header = new GetPropertyInformationISOLookUpOnlyHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationISOLookUpOnly(requestPayload, header)
      return res
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformationISOLookUpOnly " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   *
   * synchronous event to GetPropertyInformation360ValueLookUpOnly from Tuna WebService
   * @param requestPayload : request xml will be append to the service method
   * @return PropertyGeographyModel : response is available in this object
   */
  function getPropertyInformation360ValueLookUpOnly(requestPayload: GetPropertyInformationRequestModel):
      PropertyGeographyModel {
    try {
      logger.debug(" Sending request to TUNA: GetPropertyInformation360ValueLookUpOnly TunaCommunicator",
          this.IntrinsicType)
      var header = new GetPropertyInformation360ValueLookUpOnlyHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformation360ValueLookUpOnly(requestPayload, header)
      return res
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformation360ValueLookUpOnly " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }
}