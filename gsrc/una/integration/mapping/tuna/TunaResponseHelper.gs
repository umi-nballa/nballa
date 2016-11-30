package una.integration.mapping.tuna

uses una.model.PropertyDataModel
uses wsi.remote.una.tuna.quoteservice.anonymous.elements.ArrayOfPropertyDatumModel_PropertyDatumModel
uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel

uses java.util.ArrayList

/**
 *
 * User: pyerrumsetty
 * Date: 11/20/16
 * Time: 5:38 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaResponseHelper {

  final static var YEAR_BUILT = "YearBuilt"
  final static var STORIES_NUMBER = "NumberOfStories"
  final static var CONSTRUCTION_TYPE = "TypeOfConstruction"
  final static var SQUARE_FOOTAGE = "TotalSquareFootage"
  final static var ROOF_TYPE = "RoofType"
  final static var ROOF_COVER = "RoofCover"
  final static var WIND_POOL = "WindPool"
  final static var BCEG = "BCEG"
  final static var FIRE_LINE_MATCH_LEVEL = "FirelineMatchLevel"
  final static var DISTANCE_TO_COAST = "DistanceToCoast"
  final static var PROTECTION_CLASS = "ProtectionClass"
  final static var EXTERIOR_WALL_FINISH = "ExteriorWallFinish"
  final static var ISO_360_VALUE = "ISO360ValuationId"
  final static var ESTIMATED_REPLACEMENT_COST = "CondoReplacementCost"
  final static var FIRE_DEPT_MATCH_LEVEL = "DistanceToMajorBOW"
  final static var FIRE_LINE_ADJUSTED_HAZARD = "FirelineAdjustedHazardScore"
  final static var FIRE_LINE_FUEL = "FirelineFuel"
  final static var FIRE_LINE_ACCESS = "FirelineAccess"
  final static var FIRE_LINE_SLOPE = "FirelineSlope"
  final static var FIRE_LINE_SHIA = "FirelineSHIA"


  // Mapping datums
  function mapDatumsTunaResponse(tunaResponse: PropertyGeographyModel, response: TunaAppResponse): TunaAppResponse {

    //Datums details
    var propertyModelDetails = tunaResponse.Datums.PropertyDatumModel

    for (propDetail in propertyModelDetails) {

      switch (propDetail.Id) {

        case YEAR_BUILT:
            var yearList = dynamicListMapper(propDetail)
            response.YearBuilt = yearList
            break
        case PROTECTION_CLASS:
            var proClassList = dynamicListMapper(propDetail)
            response.ProtectionClass = proClassList
            break
        case DISTANCE_TO_COAST:
            var distanceToCoastList = dynamicListMapper(propDetail)
            response.DistanceToCoast = distanceToCoastList
            break
        case FIRE_DEPT_MATCH_LEVEL:
            var fireDeptList = dynamicListMapper(propDetail)
            response.FireDepartmentMatchLevel = fireDeptList
            break
        case BCEG:
            var BCEGList = dynamicListMapper(propDetail)
            response.BCEGGrade = BCEGList
            break
        case ESTIMATED_REPLACEMENT_COST:
            var estimateReplacementCostList = dynamicListMapper(propDetail)
            response.EstimatedReplacementCost = estimateReplacementCostList
            break
        case ISO_360_VALUE:
            var ISOList = dynamicListMapper(propDetail)
            response.ISO360Value = ISOList
            break
        case FIRE_LINE_ADJUSTED_HAZARD:
            var hazardList = dynamicListMapper(propDetail)
            response.AdjustedHazard = hazardList
            break
        case FIRE_LINE_FUEL:
            var fuelList = dynamicListMapper(propDetail)
            response.FireLineFuel = fuelList
            break
        case FIRE_LINE_SLOPE:
            var slopeList = dynamicListMapper(propDetail)
            response.FireLineSlope = slopeList
            break
        case FIRE_LINE_ACCESS:
            var accessList = dynamicListMapper(propDetail)
            response.FireLineAccess = accessList
            break
        case STORIES_NUMBER:
            var storyNumList = dynamicListMapper(propDetail)
            response.StoryNumber = storyNumList
            break
        case CONSTRUCTION_TYPE:
            var constructionTypeList = dynamicListMapper(propDetail)
            response.ConstructionType = constructionTypeList
            break
        case EXTERIOR_WALL_FINISH:
            var wallFinishList = dynamicListMapper(propDetail)
            response.WallFinish = wallFinishList
            break
        case SQUARE_FOOTAGE:
            var squareFootageList = dynamicListMapper(propDetail)
            response.SquareFootage = squareFootageList
            break
        case ROOF_COVER:
            var roofCoverList = dynamicListMapper(propDetail)
            response.RoofCover = roofCoverList
            break
        case ROOF_TYPE:
            var roofTypeList = dynamicListMapper(propDetail)
            response.RoofType = roofTypeList
            break
        case WIND_POOL:
            var windList = dynamicListMapper(propDetail)
            response.WindPool = windList
            break

      }
    }


    return response
  }

  private function dynamicListMapper(propDetail: ArrayOfPropertyDatumModel_PropertyDatumModel): ArrayList<PropertyDataModel> {
    var list = new ArrayList<PropertyDataModel>()
    if (propDetail.ListValue.PropertyDatumModel.Count >= 1) {
      for (lValue in propDetail.ListValue.PropertyDatumModel) {
        var propertyDataModelResponse = new PropertyDataModel()
        propertyDataModelResponse.Value = lValue.Value
        propertyDataModelResponse.Percent = lValue.Percent
        list.add(propertyDataModelResponse)
      }
    }
    else {
      var propertyDataModelResponse = new PropertyDataModel()
      propertyDataModelResponse.Value = propDetail.Value
      propertyDataModelResponse.Percent = propDetail.Percent
      list.add(propertyDataModelResponse)
    }
    return list
  }
}