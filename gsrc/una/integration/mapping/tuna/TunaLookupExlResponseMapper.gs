package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.lang.Exception

/**
 * Created for mapping the GetPropertyInformation360LookupOnly(Exl) response
 * Created By: pavan theegala
 * Created Date: 6/16/16
 */
class TunaLookupExlResponseMapper extends  TunaResponseMapper {
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = TunaLookupExlResponseMapper.Type.DisplayName
  var response : TunaAppResponse
  var helper = new TunaResponseHelper()

  /*TBD - Response should map to the PCF */
  override function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
    response = new TunaAppResponse()
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
      response.Status = tunaResponse.Status
      response.IsExact = tunaResponse.IsExact
      response.ResultingPrecision = tunaResponse.ResultingPrecision
      response = helper.mapDatumsTunaResponse(tunaResponse,response)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
    }catch (exp: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + exp.StackTraceAsString)
      throw exp
    }
    return response
  }

}