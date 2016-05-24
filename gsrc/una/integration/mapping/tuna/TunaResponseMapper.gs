package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses java.lang.NullPointerException
uses java.lang.Exception
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 5/11/16
 * Time: 6:11 PM
 */

class TunaResponseMapper {
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  public function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
    var response = new TunaAppResponse()

    try {

      //TODO Tuna response to TunaAPPResponse

    } catch (e: NullPointerException) {
      logger.error("Tuna Respone Mapping Failure NullPointer  : StackTrace = " + e.StackTraceAsString)
    } catch (e1: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + e1.StackTraceAsString)
    }


    return response
  }
}