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


  override function getPropertyInformationComplete(policyPeriod: PolicyPeriod): TunaAppResponse {

   try{
    logger.debug(" Inside Tunagateway GetPropertyInformationComplete ", this.IntrinsicType)
    var reqMapper = new TunaRequestMapper()
    var request = reqMapper.createRequestMapper(policyPeriod)
    var tunaResponse = sendToTuna(request)
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

  override function getPropertyInformation(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function getPropertyInformationScrubOnly(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function getPropertyInformationGeoLookUp(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function getPropertyInformation360ValueLookUpOnlyExl(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }

  override function getPropertyInformation360ValueLookUpOnlyInc(policyPeriod: PolicyPeriod): TunaAppResponse {
    return null
  }


  private function sendToTuna(requestPayload : GetPropertyInformationRequestModel ) : PropertyGeographyModel {
   logger.info(" Tuna Call " , this.IntrinsicType)
   tunaCommunicator.sendTunaRequest(requestPayload)
   return null
  }






}