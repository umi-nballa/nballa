package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses una.model.PropertyDataModel
uses una.model.PropertyTerritoryModel
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.lang.Double
uses java.lang.Exception
uses java.util.ArrayList
uses org.apache.commons.lang3.StringUtils

/**
 * Created for mapping the GetPropertyInformation response
 * Created By: pavan theegala
 * Created Date: 6/16/16
 */
class TunaInformationResponseMapper extends TunaResponseMapper {
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = TunaInformationResponseMapper.Type.DisplayName
  var response: TunaAppResponse
  var helper = new TunaResponseHelper()

  /**
   * Tuna Response is Mapped to Transient Object to map in PCF
   * @param tunaResponse of type PropertyGeographyModel from Tuna
   * @return response
   */
  override  function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
    response = new TunaAppResponse()
    try {
      logger.debug(" Entering  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
      response.Status = tunaResponse.Status
      response.ScrubStatus = tunaResponse.Address.ScrubStatus
      response.AddressLine1 = tunaResponse.Address.Street.Number + " "
          + (StringUtils.isNotBlank(tunaResponse.Address.Street.PreDirection)? tunaResponse.Address.Street.PreDirection + " " : "" )
          + tunaResponse.Address.Street.Name
          + (StringUtils.isNotBlank(tunaResponse.Address.Street.Type)? " " + tunaResponse.Address.Street.Type : "" )
          + (StringUtils.isNotBlank(tunaResponse.Address.Street.PostDirection)? " " + tunaResponse.Address.Street.PostDirection : "")
      response.City = tunaResponse.Address.City
      response.PostalCode = tunaResponse.Address.Zipcode.Major + "-" + tunaResponse.Address.Zipcode.Minor
      response.State = tunaResponse.Address.State
      response.CountyName = tunaResponse.Address.CountyName
      response.Note = tunaResponse.Address.Note
      response.NoteDetail = tunaResponse.Address.NoteDetail
      response.IsExact = tunaResponse.IsExact
      response.USPSOnly = tunaResponse.Address.USPSOnly
      response.ResultingPrecision = tunaResponse.ResultingPrecision
      response.Latitude = tunaResponse.Coordinates.Latitude
      response.Longitude = tunaResponse.Coordinates.Longitude
      var counties = tunaResponse.Counties.PropertyDatumModel
      var countyList = new ArrayList<String>()
      for (details in counties) {
        countyList.add(details.Value)
      }
      response.Counties = countyList
      //return list of territory codes
      var territoryLine = tunaResponse.Lines.PropertyLine*.Territories*.PropertyTerritory?.first()
      var territoryCodeList = new ArrayList<String>()
      for(detail in territoryLine){
        territoryCodeList.add(detail.Code)
      }
      response.TerritoryCodes = territoryCodeList

      var comTerritoryLine = tunaResponse.CommercialLines?.PropertyLine?.firstWhere( \ elt -> elt.Line == "C")
      if(comTerritoryLine != null){
        var commercialTerritoryCodeList = new ArrayList<String>()
      for(tTory in comTerritoryLine.Territories?.PropertyTerritory){
        commercialTerritoryCodeList.add(tTory.Code)
       }
        response.CPPTerritoryCodes = commercialTerritoryCodeList
      }


      var bopTerritoryLine = tunaResponse.CommercialLines?.PropertyLine?.firstWhere( \ elt -> elt.Line == "B")
      if(bopTerritoryLine != null){
        var businessTerritoryCodeList = new ArrayList<String>()
      for(tTory in bopTerritoryLine.Territories?.PropertyTerritory){
        businessTerritoryCodeList.add(tTory.Code)
      }
        response.BOPTerritoryCodes = businessTerritoryCodeList
     }

      response = helper.mapDatumsTunaResponse(tunaResponse,response)
      logger.debug(" Leaving  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + exp.StackTraceAsString)
      throw exp
    }
    return response
  }
}