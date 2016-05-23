package una.integration.service.gateway.tuna

uses gw.api.address.AddressFillable
uses una.integration.mapping.tuna.TunaAppResponse
uses una.integration.mapping.tuna.TunaRequestMapper
uses una.integration.mapping.tuna.TunaResponseMapper
uses una.integration.service.transport.tuna.TunaCommunicator
uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.lang.Exception

/**
 * TunaGateway Implementation class for calling tuna service.
 * Created By: pyerrumsetty
 */
class TunaGateway implements TunaInterface {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  var tunaCommunicator: TunaCommunicator
  var reqMapper: TunaRequestMapper
  var resMapper: TunaResponseMapper
  var timeout = "500"

  construct(thresholdTimeout: String) {
    timeout = thresholdTimeout
    tunaCommunicator = new TunaCommunicator()
    reqMapper = new TunaRequestMapper()
    resMapper = new TunaResponseMapper()
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param policyPeriod have the values entered in Create account screen
   */
  override function fetchPropertyInformationComplete(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Inside Tunagateway GetPropertyInformationComplete ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      var tunaResponse = tunaCommunicator.getPropertyInformationComplete(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.debug(" Tuna Call Complete GetPropertyInformationComplete ", this.IntrinsicType)
      return response
    } catch (e: Exception) {
      logger.error("TunaGateway : getPropertyInformationComplete " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param policyPeriod have the values entered in Create account screen
   */
  override function fetchPropertyInformation(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Inside Tunagateway GetPropertyInformation ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      var tunaResponse = tunaCommunicator.getPropertyInformation(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.debug(" Tuna Call Complete GetPropertyInformation ", this.IntrinsicType)
      return response
    } catch (e: Exception) {
      logger.error("TunaGateway : GetPropertyInformation " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param policyPeriod have the values entered in Create account screen
   */
  override function fetchPropertyInformationScrubOnly(address: AddressFillable): TunaAppResponse {
    try {
      logger.debug(" Inside Tunagateway GetPropertyInformationScrubOnly ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(address)
      var tunaResponse = tunaCommunicator.getPropertyInformationScrubOnly(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.debug(" Tuna Call Complete GetPropertyInformationScrubOnly ", this.IntrinsicType)
      return response
    } catch (e: Exception) {
      logger.error("TunaGateway : GetPropertyInformationScrubOnly " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param policyPeriod have the values entered in Create account screen
   */
  override function fetchPropertyInformationGeoLookUp(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Inside Tunagateway GetPropertyInformationGeoLookUp ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      var tunaResponse = tunaCommunicator.getPropertyInformationGeoLookUp(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.debug(" Tuna Call Complete GetPropertyInformationGeoLookUp ", this.IntrinsicType)
      return response
    } catch (e: Exception) {
      logger.error("TunaGateway : GetPropertyInformationGeoLookUp " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param policyPeriod have the values entered in Create account screen
   */
  override function fetchPropertyInformation360ValueLookUpOnlyExl(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Inside Tunagateway GetPropertyInformation360ValueLookUpOnlyExl ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      var tunaResponse = tunaCommunicator.getPropertyInformationISOLookUpOnly(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.debug(" Tuna Call Complete GetPropertyInformation360ValueLookUpOnlyExl ", this.IntrinsicType)
      return response
    } catch (e: Exception) {
      logger.error("TunaGateway : GetPropertyInformation360ValueLookUpOnlyExl " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param policyPeriod have the values entered in Create account screen
   */
  override function fetchPropertyInformation360ValueLookUpOnlyInc(policyPeriod: PolicyPeriod): TunaAppResponse {
    try {
      logger.debug(" Inside Tunagateway GetPropertyInformation360ValueLookUpOnlyInc ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(policyPeriod)
      var tunaResponse = tunaCommunicator.getPropertyInformation360ValueLookUpOnly(req)
      var response = resMapper.tunaAppResponse(tunaResponse)
      logger.debug(" Tuna Call Complete GetPropertyInformation360ValueLookUpOnlyInc ", this.IntrinsicType)
      return response
    } catch (e: Exception) {
      logger.error("TunaGateway : GetPropertyInformation360ValueLookUpOnlyInc " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

  /**
   * synchronous event to validate the property information from Tuna WebService
   * @param address have the values entered in Create account screen
   */
  override function validateAddress(address: AddressFillable): PropertyGeographyModel {
    try {
      logger.debug(" Inside Tunagateway FetchAddressValidation ", this.IntrinsicType)
      var req = reqMapper.createRequestModel(address)
      var tunaResponse = tunaCommunicator.getPropertyInformationScrubOnly(req)
      print("response " + tunaResponse.toString())
      logger.debug(" Tuna Call Complete FetchAddressValidation ", this.IntrinsicType)
      return tunaResponse
    } catch (e: Exception) {
      logger.error("TunaGateway : FetchAddressValidation " + " : StackTrace = " + e.StackTraceAsString)
      throw e
    }
  }

}