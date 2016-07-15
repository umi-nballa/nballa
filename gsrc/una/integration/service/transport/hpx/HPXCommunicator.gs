package una.integration.service.transport.hpx

uses una.logging.UnaLoggerCategory
uses wsi.remote.una.hpx.engineservice.EngineService
uses wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeRequest
uses wsi.remote.una.hpx.engineservice_schema1.types.complex.EwsComposeResponse
uses java.lang.Exception
uses wsi.remote.una.hpx.engineservice_schema1.types.complex.Header

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 7/12/16
 * Time: 11:54 AM
 */

class HPXCommunicator {

  final static var logger = UnaLoggerCategory.UNA_INTEGRATION

  function ewsEngineService(request : EwsComposeRequest) : EwsComposeResponse {

   try{

   var res = new EngineService()
   var ewsResponse = res.Compose(request)
   var x =  ewsResponse.Files.toArray()

   var fileOutput =  ewsResponse.Files.first().FileOutput

   return ewsResponse
  } catch (exp: Exception) {
  logger.error("HPXCommunicator Exception " + exp.StackTraceAsString)
  throw exp
  }
  }
}