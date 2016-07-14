package una.integration.service.gateway.hpx


uses una.logging.UnaLoggerCategory
uses wsi.schema.una.hpx.hpx_application_request.PublishDocumentRequest

uses wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest
uses java.io.File
uses java.io.FileInputStream
uses org.apache.commons.io.IOUtils
uses una.integration.service.transport.hpx.HPXCommunicator
uses java.lang.Exception
uses org.apache.commons.codec.binary.Base64

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


  construct() {
       reqMapper = new PublishDocumentRequest()
       ewsRequest = new EwsComposeRequest()

    }


  override function generateDocuments(policyPeriod: PolicyPeriod): String {

    try{

          var file = new File("C:\\Universal\\testxml\\xml.txt")
          var myScan = new FileInputStream(file)
          var bytes  = IOUtils.toByteArray(myScan)
          ewsRequest.Driver.Driver = new gw.xml.BinaryData(bytes)
          ewsRequest.Driver.FileName = "EWS_INPUT"
          ewsRequest.IncludeHeader = true
          ewsRequest.IncludeMessageFile = true
          ewsRequest.PubFile = "PolicyCenterNA.pub"

       //call EWS
          var response = new HPXCommunicator()
          response.ewsEngineService(ewsRequest)

       // Todo : map response to response object mapper



      return "Success"
    } catch (exp: Exception) {
      logger.error( "Exception while calling EWS " + exp)
      throw exp
    }
  }
}