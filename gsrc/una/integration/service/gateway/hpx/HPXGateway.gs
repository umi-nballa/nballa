package una.integration.service.gateway.hpx


uses una.logging.UnaLoggerCategory
uses wsi.schema.una.hpx.hpx_application_request.PublishDocumentRequest

uses wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest
uses java.io.File
uses java.io.FileInputStream
uses org.apache.commons.io.IOUtils
uses una.integration.service.transport.hpx.HPXCommunicator
uses una.integration.mapping.hpx.common.HPXResponseMapper
uses java.lang.Exception
uses org.apache.commons.codec.binary.Base64
uses una.integration.mapping.hpx.common.HPXRequestMapper

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 7/12/16
 * Time: 10:47 AM
 */

class HPXGateway implements HPXInterface {

  final static var logger = UnaLoggerCategory.UNA_INTEGRATION

  var reqMapper: PublishDocumentRequest
  var ewsRequest :EwsComposeRequest
  var timeout = "500"

  construct(thresholdTimeout: String) {
       timeout = thresholdTimeout
       reqMapper = new PublishDocumentRequest()
       ewsRequest = new EwsComposeRequest()

    }


  override function generateDocuments(ewsRequestXML : wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest): wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeResponse {

    try{
          var hpxComm = new HPXCommunicator()
          var ewsResponse = hpxComm.ewsEngineService(ewsRequestXML)
          var responseMapper = new HPXResponseMapper()
          //responseMapper.updateResponseModel(ewsResponse)

      return ewsResponse
    } catch (exp: Exception) {
      logger.error( "Exception while calling EWS " + exp)
      throw exp
    }
  }
}