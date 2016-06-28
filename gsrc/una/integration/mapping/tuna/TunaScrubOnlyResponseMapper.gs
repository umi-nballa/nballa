package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel
uses java.lang.Exception


/**
 * Created for mapping the GetPropertyInformationScrubOnly response
 * Created By: pavan theegala
 * Created Date: 6/16/16
 */
class TunaScrubOnlyResponseMapper extends TunaResponseMapper {
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = TunaScrubOnlyResponseMapper.Type.DisplayName
  var response : TunaAppResponse

  /**
   * Tuna Response is Mapped to Transient Object to map in PCF
   * @param tunaResponse of type PropertyGeographyModel from Tuna
   * @return response
   */
  override function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
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
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + exp.StackTraceAsString)
      throw exp
    }
    return response
  }
}