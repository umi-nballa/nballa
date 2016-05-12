package una.integration.service.gateway.tuna

uses una.integration.mapping.tuna.TunaAppResponse
uses una.integration.service.transport.tuna.TunaCommunicator
uses una.logging.UnaLoggerCategory
uses una.integration.mapping.tuna.TunaRequestMapper
uses java.lang.Exception
uses una.integration.mapping.tuna.TunaResponseMapper
uses wsi.remote.una.tuna.quoteservice.types.complex.GetPropertyInformationRequestModel
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 5/11/16
 * Time: 1:41 PM
 */
class TunaGateway implements TunaInterface {
  var tunaCommunicator = new TunaCommunicator()
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  var timeout = 500


  construct(thresholdTimeout : int){
    this.timeout = thresholdTimeout
  }


  override function fetchPropertyInformationComplete(policyPeriod: PolicyPeriod): TunaAppResponse {

   try{
    logger.debug(" Inside Tunagateway GetPropertyInformationComplete ", this.IntrinsicType)
    var reqMapper = new TunaRequestMapper()
    var req = reqMapper.createRequestMapper(policyPeriod)
    var tunaResponse = tunaCommunicator.GetPropertyInformationComplete(req)
    var resMapper = new TunaResponseMapper()
    var response = resMapper.tunaAppResponse(tunaResponse)

    logger.debug(" Tuna Call Complete GetPropertyInformationComplete " , this.IntrinsicType)

    return response
  } catch (e : Exception) {
    logger.error("TunaGateway : getPropertyInformationComplete "  +  " : StackTrace = " + e.StackTraceAsString)
     throw e
   } finally {

   }
  }

  override function fetchPropertyInformation(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function fetchPropertyInformationScrubOnly(policyPeriod: PolicyPeriod): TunaAppResponse {
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