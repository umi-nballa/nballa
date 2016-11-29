package una.integration.mapping.tuna

uses una.logging.UnaLoggerCategory
uses una.model.PropertyDataModel
uses una.model.PropertyTerritoryModel
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.lang.Double
uses java.lang.Exception
uses java.util.ArrayList

/**
 * Created for mapping the GetPropertyInformationComplete response
 * Created By: pavan theegala
 * Created Date: 6/16/16
 */
class TunaInformationCompleteResponseMapper extends TunaResponseMapper {
  var logger = UnaLoggerCategory.UNA_INTEGRATION
  static final var CLASS_NAME = TunaInformationCompleteResponseMapper.Type.DisplayName
  var response : TunaAppResponse
  var helper = new TunaResponseHelper()

  /**
   * Tuna Response is Mapped to Transient Object to map in PCF
   * @param tunaResponse of type PropertyGeographyModel from Tuna
   * @return response
   */
  override function tunaAppResponse(tunaResponse: PropertyGeographyModel): TunaAppResponse {
     response = new TunaAppResponse()

    try {
      logger.info(" Entering  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
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

//      var countyList = new ArrayList<PropertyDataModel>()
//      for (details in counties) {
//        var propertyDataModelResponse = new PropertyDataModel()
//        propertyDataModelResponse.ID = details.Id
//        propertyDataModelResponse.Value = details.Value
//        propertyDataModelResponse.Percent = (details.Percent) as Double
//        countyList.add(propertyDataModelResponse)
//      }


      //return list of counties
       var counties = tunaResponse.Counties.PropertyDatumModel
       var countyList = new ArrayList<String>()
       for (details in counties) {
         countyList.add(details.Value)
       }
       response.Counties = countyList

//       response.Line = tunaResponse.Lines.PropertyLine.Line
//       var territoryLine = tunaResponse.Lines.PropertyLine*.Territories*.PropertyTerritory
//      var territoryList = new ArrayList<PropertyTerritoryModel>()
//      for (details in territoryLine) {
//        var propertyTerritoryResponse= new PropertyTerritoryModel()
//        propertyTerritoryResponse.Code = details.Code.first()
//        propertyTerritoryResponse.Name = details.Name.first()
//        //propertyTerritoryResponse.PercentTerritory = details.PercentTerritory
//        territoryList.add(propertyTerritoryResponse)
//      }
//      response.TerritoryDetails = territoryList

      //return list of territory codes
      var territoryLine = tunaResponse.Lines.PropertyLine*.Territories*.PropertyTerritory?.first()
      var territoryCodeList = new ArrayList<String>()
      for(detail in territoryLine){
          territoryCodeList.add(detail.Code)
      }
      response.TerritoryCodes = territoryCodeList

      //Map datums

      response = helper.mapDatumsTunaResponse(tunaResponse,response)

//      var propertyModelDetails = tunaResponse.Datums.PropertyDatumModel
//
//      var propertyList = new ArrayList<PropertyDataModel>()
//      var propertyInnerList = new ArrayList<PropertyDataModel>()
//      for (details in propertyModelDetails) {
//        var propertyDataModelResponse = new PropertyDataModel()
//        propertyDataModelResponse.ID = details.Id
//        propertyDataModelResponse.Value = details.Value
//        propertyDataModelResponse.Percent = (details.Percent) as Double
//        propertyDataModelResponse.NamedValue = details.NamedValue
//        propertyDataModelResponse.Line = details.Line
//        propertyDataModelResponse.LevelRecord = details.LevelRecord
//        if(details.ListValue != null){
//        var listValue = details.ListValue.PropertyDatumModel
//        for(itr in listValue){
//         var propertyDataModelResponseInr = new PropertyDataModel()
//          propertyDataModelResponseInr.ID = details.Id
//          propertyDataModelResponseInr.Value = details.Value
//          propertyDataModelResponseInr.Percent = (details.Percent) as Double
//          propertyDataModelResponseInr.NamedValue = details.NamedValue
//          propertyDataModelResponseInr.Line = details.Line
//          propertyDataModelResponseInr.LevelRecord = details.LevelRecord
//          propertyInnerList.add(propertyDataModelResponseInr)
//          }
//          propertyDataModelResponse.ListValue = propertyInnerList
//        }
//        propertyList.add(propertyDataModelResponse)
//      }
//      response.Datums = propertyList
      logger.info(" Leaving  " + CLASS_NAME + " :: " + " tunaAppResponse" + "For response Mapping ", this.IntrinsicType)
    } catch (exp: Exception) {
      logger.error("Tuna Response Mapping Failure  : Stacktrace = " + exp.StackTraceAsString)
      throw exp
    }
    return response
  }
}