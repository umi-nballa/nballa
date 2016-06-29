package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel
uses java.lang.NullPointerException
uses java.lang.Exception
uses una.model.PropertyDataModel
uses java.util.ArrayList
uses java.lang.Double

/**
 * Created for mapping the GetPropertyInformation360LookupOnly(Exl) response
 * Created By: pavan theegala
 * Created Date: 6/16/16
 */
class TunaLookupExlResponseMapper extends  TunaResponseMapper {
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = TunaLookupExlResponseMapper.Type.DisplayName
  var response : TunaAppResponse

  /*TBD - Response should map to the PCF */
  override function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
    response = new TunaAppResponse()
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
      response.Status = tunaResponse.Status
      response.IsExact = tunaResponse.IsExact
      response.ResultingPrecision = tunaResponse.ResultingPrecision
      var propertyModelDetails = tunaResponse.Datums.PropertyDatumModel
      var propertyList = new ArrayList<PropertyDataModel>()
      for (details in propertyModelDetails) {
        var propertyDataModelResponse = new PropertyDataModel()
        propertyDataModelResponse.ID = details.Id
        propertyDataModelResponse.Value = details.Value
        propertyDataModelResponse.Percent = (details.Percent) as Double
        propertyDataModelResponse.NamedValue = details.NamedValue
        propertyDataModelResponse.Line = details.Line
        propertyDataModelResponse.LevelRecord = details.LevelRecord
        propertyList.add(propertyDataModelResponse)
      }
      response.Datums = propertyList
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
    }catch (exp: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + exp.StackTraceAsString)
      throw exp
    }
    return response
  }

}