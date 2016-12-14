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
  final static var DISTANCE_TO_MAJOR_BOW = "DistanceToMajorBOW"
  final static var FIRE_LINE_ADJUSTED_HAZARD = "FirelineAdjustedHazardScore"
  final static var FIRE_LINE_FUEL = "FirelineFuel"
  final static var FIRE_LINE_ACCESS = "FirelineAccess"
  final static var FIRE_LINE_SLOPE = "FirelineSlope"
  final static var FIRE_LINE_SHIA = "FirelineSHIA"
  final static var EARTH_QUAKE_TERRITORY = "EarthquakeTerritory"
  final static var COVERAGE_A_LIMIT = "CoverageALimit"

  final static var BASE_FLOOD_ELEVATION = "BaseFloodElevation"
  final static var CONDO_VALUATION_ID = "CondoValuationId"
  final static var FIRE_LINE_PROPERTY_HAZARD = "FirelinePropertyHazardScore"
  final static var METRICS_VERSION = "MetricsVersion"
  final static var PROPERTY_FLOOD = "PropertyFlood"
  final static var ACV = "ACV"



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
        case DISTANCE_TO_MAJOR_BOW:
            var distanceToMajorBOW = dynamicListMapper(propDetail)
            response.DistanceToMajorBOW = distanceToMajorBOW
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
        case EARTH_QUAKE_TERRITORY:
            var earthQuakeList = dynamicListMapper(propDetail)
            response.EarthQuakeTerritory = earthQuakeList
            break
        case COVERAGE_A_LIMIT:
            var coverageALimit = dynamicListMapper(propDetail)
            response.CoverageLimit = coverageALimit
            break
        case BASE_FLOOD_ELEVATION:
            var baseFloodElevation = dynamicListMapper(propDetail)
            response.BaseFloodElevation = baseFloodElevation
            break
        case CONDO_VALUATION_ID:
            var condoValuationID = dynamicListMapper(propDetail)
            response.CondoValuationID = condoValuationID
            break
        case FIRE_LINE_PROPERTY_HAZARD:
            var fireLinePropertyHazard = dynamicListMapper(propDetail)
            response.FireLinePropertyHazard = fireLinePropertyHazard
            break
        case METRICS_VERSION:
            var metricsVersion = dynamicListMapper(propDetail)
            response.MetricsVersion = metricsVersion
            break
        case PROPERTY_FLOOD:
            var propertyFlood = dynamicListMapper(propDetail)
            response.PropertyFlood = propertyFlood
            break
        case ACV:
            var acv = dynamicListMapper(propDetail)
            response.ACV = acv
            break
        case FIRE_LINE_SHIA:
            var fireLineSHIA = dynamicListMapper(propDetail)
            response.FireLineSHIA = fireLineSHIA
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
        propertyDataModelResponse.NamedValue = lValue.NamedValue
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