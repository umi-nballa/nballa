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
 * Created  by: Prathyush on 5/14/2016
 *
 */
class TunaCommunicator {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = TunaCommunicator.Type.DisplayName
  final static var service = new wsi.remote.una.tuna.quoteservice.QuoteService()
  /**
   *
   * The method hits the TUNA - GetPropertyInformationComplete Service (Requirement Yet to Update)
   * @param requestPayload : request payload is passed as a parameter
   * @return res Returns PropertyGeographyModel response
   */
  function getPropertyInformationComplete(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformationComplete" + "For SUBMISSION ", this.IntrinsicType)
      var header = new GetPropertyInformationCompleteHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationComplete(requestPayload, header)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformationComplete" + "For SUBMISSION ", this.IntrinsicType)
      return res
    } catch (exp: Exception) {
      logger.error( CLASS_NAME + " :: " + " getPropertyInformationComplete " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * TBD - No Implementation Available
   */
  function getPropertyInformation(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformation" + "For ", this.IntrinsicType)
      var header = new GetPropertyInformationHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformation(requestPayload, header)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformation" + "For ", this.IntrinsicType)
      return res
    } catch (exp: Exception) {
      logger.error( CLASS_NAME + " :: " + " getPropertyInformation " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   *
   * The method hits the TUNA - GetPropertyInformationScrubOnly Service to validate the address
   * @param requestPayload : request payload is passed as a parameter
   * @return res Returns PropertyGeographyModel response
   */
  function getPropertyInformationScrubOnly(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformationScrubOnly" + "For Address Validation ", this.IntrinsicType)
      var header = new GetPropertyInformationScrubOnlyHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationScrubOnly(requestPayload, header)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformationScrubOnly" + "For Address Validation ", this.IntrinsicType)
      return res
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " getPropertyInformationScrubOnly " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   *TBD - No Implementation Available
   */
  function getPropertyInformationGeoLookUp(requestPayload: GetPropertyInformationRequestModel): PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformationGeoLookUp" + "For ", this.IntrinsicType)
      var header = new GetPropertyInformationGeoLookUpHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationGeoLookUp(requestPayload, header)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformationGeoLookUp" + "For ", this.IntrinsicType)
      return res
    } catch (exp: Exception) {
      logger.error( CLASS_NAME + " :: " + " getPropertyInformationGeoLookUp " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   *TBD - No Implementation Available
   */
  function getPropertyInformationISOLookUpOnly(requestPayload: GetPropertyInformationRequestModel):
      PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformationISOLookUpOnly" + "For ", this.IntrinsicType)
      var header = new GetPropertyInformationISOLookUpOnlyHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformationISOLookUpOnly(requestPayload, header)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformationISOLookUpOnly" + "For ", this.IntrinsicType)
      return res
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " getPropertyInformationISOLookUpOnly " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * TBD  - No Implementation Available
   */
  function getPropertyInformation360ValueLookUpOnly(requestPayload: GetPropertyInformationRequestModel):
      PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " getPropertyInformation360ValueLookUpOnly" + "For ", this.IntrinsicType)
      var header = new GetPropertyInformation360ValueLookUpOnlyHeaders()
      header.QuoteAuthenticationHeader = quoteAuthenticationInformation()
      var res = service.GetPropertyInformation360ValueLookUpOnly(requestPayload, header)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " getPropertyInformation360ValueLookUpOnly" + "For ", this.IntrinsicType)
      return res
    } catch (exp: Exception) {
      logger.error( CLASS_NAME + " :: " + " getPropertyInformation360ValueLookUpOnly " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * Sending Authenticating details to the service
   */
  private function quoteAuthenticationInformation(): QuoteAuthenticationHeader
  {
    try {
      var headerQuote = new QuoteAuthenticationHeader()
      headerQuote.Username = PropertiesHolder.getProperty("TUNA_GATEWAY_USERNAME")
      headerQuote.Password = PropertiesHolder.getProperty("TUNA_GATEWAY_PASSWORD")
      return headerQuote
    } catch (exp: Exception) {
      logger.error( CLASS_NAME + " :: " + " quoteAuthenticationInformation " + " : StackTrace = " + exp)
      throw exp
    }
  }
}