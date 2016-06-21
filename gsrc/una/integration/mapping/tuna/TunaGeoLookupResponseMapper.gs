package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel
uses java.lang.NullPointerException
uses java.lang.Exception
uses java.util.ArrayList
uses una.model.PropertyDataModel
uses java.lang.Double

/**
 * Created for mapping the GetPropertyInformationGeoLookUp response
 * Created By: pavan theegala
 * Created Date: 6/16/16
 */
class TunaGeoLookupResponseMapper extends TunaResponseMapper{
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = TunaGeoLookupResponseMapper.Type.DisplayName
  var response : TunaAppResponse

  /*TBD - Response should map to the PCF */
  override  function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
    response = new TunaAppResponse()
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
      response.Status = tunaResponse.Status
      response.ScrubStatus = tunaResponse.Address.ScrubStatus
      response.AddressLine1 = tunaResponse.Address.Street.Number + " " + tunaResponse.Address.Street.Name + " " + tunaResponse.Address.Street.Type
      response.City = tunaResponse.Address.City
      response.PostalCode = tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor
      response.State = tunaResponse.Address.State
      response.Note = tunaResponse.Address.Note
      response.NoteDetail = tunaResponse.Address.NoteDetail
      response.IsExact = tunaResponse.IsExact
      response.USPSOnly = tunaResponse.Address.USPSOnly
      response.ResultingPrecision = tunaResponse.ResultingPrecision
      response.Latitude = tunaResponse.Coordinates.Latitude
      response.Longitude = tunaResponse.Coordinates.Longitude
      var counties = tunaResponse.Counties.PropertyDatumModel
      var countyList = new ArrayList<PropertyDataModel>()
      for (details in counties) {
        var propertyDataModelResponse = new PropertyDataModel()
        propertyDataModelResponse.ID = details.Id
        propertyDataModelResponse.Value = details.Value
        propertyDataModelResponse.Percent = (details.Percent) as Double
        countyList.add(propertyDataModelResponse)
      }
      response.Counties = countyList
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + exp.StackTraceAsString)
      throw exp
    }
    return response
  }

}