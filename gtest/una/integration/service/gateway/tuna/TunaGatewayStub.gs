package una.integration.service.gateway.tuna

uses gw.api.address.AddressFillable
uses una.integration.mapping.tuna.TunaAppResponse
uses una.integration.mapping.tuna.TunaScrubOnlyResponseMapper
uses una.integration.service.transport.tuna.TunaCommunicatorStub
uses una.logging.UnaLoggerCategory
uses una.model.AddressDTO

uses java.lang.Exception

/**
 * Author: pyerrumsetty
 *
 * Purpose: Implementation of the TUNAGateway interface to expose a stub for PolicyCenter tests to simulate
 * consuming TUNA based services.
 */
class TunaGatewayStub implements TunaInterface {
  final static var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = TunaGateway.Type.DisplayName
  var tunaComm: TunaCommunicatorStub
  var timeout: String = "500"
  construct() {
    tunaComm = new TunaCommunicatorStub()
  }

  construct(ThresholdTimeout: String) {
    this.timeout = ThresholdTimeout
  }

  /**
   * The method is Stub implementation
   */
  override function fetchPropertyInformationScrubOnly(address: AddressFillable): TunaAppResponse {
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " fetchPropertyInformationScrubOnly" + "For AddressValidation ", this.IntrinsicType)
      var resMapper = new TunaScrubOnlyResponseMapper()
      var tunaResponse = tunaComm.getPropertyInformationScrubOnly()
      var response = resMapper.tunaAppResponse(null)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " fetchPropertyInformationScrubOnly" + "For AddressValidation ", this.IntrinsicType)
      return null
    } catch (exp: Exception) {
      logger.error(CLASS_NAME + " :: " + " fetchPropertyInformationScrubOnly " + " : StackTrace = " + exp)
      throw exp
    }
  }

  override function fetchPropertyInformationComplete(address: AddressDTO): TunaAppResponse {
    return null
  }

  override function fetchPropertyInformation(address: AddressDTO): TunaAppResponse {
    return null
  }

  override function fetchPropertyInformationGeoLookUp(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function fetchPropertyInformation360ValueLookUpOnlyExl(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function fetchPropertyInformation360ValueLookUpOnlyInc(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }
}