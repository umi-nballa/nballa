package una.integration.service.gateway.tuna

uses gw.api.address.AddressFillable
uses una.integration.mapping.tuna.TunaAppResponse
uses una.integration.mapping.tuna.TunaRequestMapper
uses una.integration.mapping.tuna.TunaResponseMapper
uses una.integration.service.transport.tuna.TunaCommunicator
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.lang.Exception

/**
 * TunaGateway Implementation class for calling tuna service.
 * Created By: Prathyush
 */
class TunaGateway implements TunaInterface {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = TunaGateway.Type.DisplayName
  var tunaCommunicator: TunaCommunicator as tunaCommunicator
  var reqMapper: TunaRequestMapper as reqMapper
  var resMapper: TunaResponseMapper as resMapper
  var timeout = "500"

  //Parametrized constructor
  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    tunaCommunicator = new TunaCommunicator()
    reqMapper = new TunaRequestMapper()
    resMapper = new TunaResponseMapper()
  }

  /**
   * The method is invoked when user clicks on NEW SUBMISSION in GuideWire
   * @param address have the values from entity AccountLocation
   * @return getPropertyInformationCompleteResponse is returned
   */
  override function fetchPropertyInformationComplete(address: AddressDTO): PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformationComplete" + "For SUBMISSION ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(address)
      logger.info("Request For PropertyInformationComplete :"+req)
      var tunaResponse = tunaCommunicator.getPropertyInformationComplete(req)
      logger.info("Response For PropertyInformationComplete :"+tunaResponse)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformationComplete" + "For SUBMISSION ", this.IntrinsicType)
      return tunaResponse
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformationComplete " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * TBD -  No Implementation Available
   */
  override function fetchPropertyInformation(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformation" + "For ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      logger.info("Request For PropertyInformation :"+req)
      var tunaResponse = tunaCommunicator.getPropertyInformation(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.info("Response For PropertyInformation :"+response)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformation" + "For ", this.IntrinsicType)
      return response
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformation " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * The method is invoked when user enters Address Entity related fields like Address1,City,State,PostalCode in GW
   * @param address  is the Address Entity in GW
   * @return tunaResponse is the response from the TUNA Address Validation Service - getPropertyInformationScrubOnly
   */
  override function fetchPropertyInformationScrubOnly(address: AddressFillable): PropertyGeographyModel {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformationScrubOnly" + "For AddressValidation ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(address)
      logger.info("Request For ScrubOnly :"+req)
      var tunaResponse = tunaCommunicator.getPropertyInformationScrubOnly(req)
      logger.info("Response For ScrubOnly :"+tunaResponse)
      logger.info("AddressLine1:" + address.AddressLine1 +" "+address.City +"State: "+address.State.DisplayName +"PostalCode:"
          +address.PostalCode +"Country: "+address.Country.DisplayName)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformationScrubOnly" + "For AddressValidation ", this.IntrinsicType)
      return tunaResponse
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformationScrubOnly " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * TBD - No Implementation Available
   */
  override function fetchPropertyInformationGeoLookUp(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformationGeoLookUp" + "For ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      logger.info("Request For GeoLookUp :"+req)
      var tunaResponse = tunaCommunicator.getPropertyInformationGeoLookUp(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.info("Response For GeoLookUp :"+response)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformationGeoLookUp" + "For ", this.IntrinsicType)
      return response
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformationGeoLookUp " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   *  TBD - No Implementation Available
   */
  override function fetchPropertyInformation360ValueLookUpOnlyExl(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformation360ValueLookUpOnlyExl" + "For ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      logger.info("Request For 360onlyExl :"+req)
      var tunaResponse = tunaCommunicator.getPropertyInformation360ValueLookUpOnly(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.info("Response For 360onlyExl :"+response)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformation360ValueLookUpOnlyExl" + "For ", this.IntrinsicType)
      return response
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformation360ValueLookUpOnlyExl " + " : StackTrace = " + exp)
      throw exp
    }
  }

  /**
   * TBD - No Implementation Available
   */
  override function fetchPropertyInformation360ValueLookUpOnlyInc(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformation360ValueLookUpOnlyInc" + "For ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      logger.info("Request For 360onlyInc :"+req)
      var tunaResponse = tunaCommunicator.getPropertyInformation360ValueLookUpOnly(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.info("Response For 360onlyInc :"+response)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformation360ValueLookUpOnlyInc" + "For ", this.IntrinsicType)
      return response
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformation360ValueLookUpOnlyInc " + " : StackTrace = " + exp)
      throw exp
    }
  }
}