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
  final static var HO_TERRITORY_CODE = "Unatory-HO"
  final static var DF_TERRITORY_CODE = "Unatory-DF"
  final static var TERRITORY_CODE = "Unatory"

  final static var BASE_FLOOD_ELEVATION = "BaseFloodElevation"
  final static var CONDO_VALUATION_ID = "CondoValuationId"
  final static var FIRE_LINE_PROPERTY_HAZARD = "FirelinePropertyHazardScore"
  final static var METRICS_VERSION = "MetricsVersion"
  final static var PROPERTY_FLOOD = "PropertyFlood"
  final static var ACV = "ACV"

  var typeCodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()



  // Mapping datums
  function mapDatumsTunaResponse(tunaResponse: PropertyGeographyModel, response: TunaAppResponse): TunaAppResponse {

    //Datums details
    var propertyModelDetails = tunaResponse.Datums.PropertyDatumModel

    for (propDetail in propertyModelDetails) {

      switch (propDetail.Id) {

        case YEAR_BUILT:
            var yearList = dynamicListMapper(propDetail,YEAR_BUILT)
            response.YearBuilt = yearList
            break
        case HO_TERRITORY_CODE:
            var hoCode = dynamicListMapper(propDetail,HO_TERRITORY_CODE)
            response.HOTerritoryCode = hoCode
            break
        case DF_TERRITORY_CODE:
            var dfCode = dynamicListMapper(propDetail,DF_TERRITORY_CODE)
            response.DFTerritoryCode = dfCode
            break
        case TERRITORY_CODE:
            var code = dynamicListMapper(propDetail,TERRITORY_CODE)
            response.TerritoryCode = code
            break
        case PROTECTION_CLASS:
            var proClassList = dynamicListMapper(propDetail,PROTECTION_CLASS)
            response.ProtectionClass = proClassList
            break
        case DISTANCE_TO_COAST:
            var distanceToCoastList = dynamicListMapper(propDetail,DISTANCE_TO_COAST)
            response.DistanceToCoast = distanceToCoastList
            break
        case DISTANCE_TO_MAJOR_BOW:
            var distanceToMajorBOW = dynamicListMapper(propDetail,DISTANCE_TO_MAJOR_BOW)
            response.DistanceToMajorBOW = distanceToMajorBOW
            break
        case BCEG:
            var BCEGList = dynamicListMapper(propDetail,BCEG)
            response.BCEGGrade = BCEGList
            break
        case ESTIMATED_REPLACEMENT_COST:
            var estimateReplacementCostList = dynamicListMapper(propDetail,ESTIMATED_REPLACEMENT_COST)
            response.EstimatedReplacementCost = estimateReplacementCostList
            break
        case ISO_360_VALUE:
            var ISOList = dynamicListMapper(propDetail,ISO_360_VALUE)
            response.ISO360Value = ISOList
            break
        case FIRE_LINE_MATCH_LEVEL:
            var fireLineMatch = dynamicListMapper(propDetail,FIRE_LINE_MATCH_LEVEL)
            response.FireLineMatchLevel = fireLineMatch
            break
        case FIRE_LINE_ADJUSTED_HAZARD:
            var hazardList = dynamicListMapper(propDetail,FIRE_LINE_ADJUSTED_HAZARD)
            response.AdjustedHazard = hazardList
            break
        case FIRE_LINE_FUEL:
            var fuelList = dynamicListMapper(propDetail,FIRE_LINE_FUEL)
            response.FireLineFuel = fuelList
            break
        case FIRE_LINE_SLOPE:
            var slopeList = dynamicListMapper(propDetail,FIRE_LINE_SLOPE)
            response.FireLineSlope = slopeList
            break
        case FIRE_LINE_ACCESS:
            var accessList = dynamicListMapper(propDetail,FIRE_LINE_ACCESS)
            response.FireLineAccess = accessList
            break
        case STORIES_NUMBER:
            var storyNumList = dynamicListMapper(propDetail,STORIES_NUMBER)
            response.StoryNumber = storyNumList
            break
        case CONSTRUCTION_TYPE:
            var constructionTypeList = dynamicListMapper(propDetail,CONSTRUCTION_TYPE)
            response.ConstructionType = constructionTypeList
            break
        case EXTERIOR_WALL_FINISH:
            var wallFinishList = dynamicListMapper(propDetail,EXTERIOR_WALL_FINISH)
            response.WallFinish = wallFinishList
            break
        case SQUARE_FOOTAGE:
            var squareFootageList = dynamicListMapper(propDetail,SQUARE_FOOTAGE)
            response.SquareFootage = squareFootageList
            break
        case ROOF_COVER:
            var roofCoverList = dynamicListMapper(propDetail,ROOF_COVER)
            response.RoofCover = roofCoverList
            break
        case ROOF_TYPE:
            var roofTypeList = dynamicListMapper(propDetail,ROOF_TYPE)
            response.RoofType = roofTypeList
            break
        case WIND_POOL:
            var windList = dynamicListMapper(propDetail,WIND_POOL)
            response.WindPool = windList
            break
        case EARTH_QUAKE_TERRITORY:
            var earthQuakeList = dynamicListMapper(propDetail,EARTH_QUAKE_TERRITORY)
            response.EarthQuakeTerritory = earthQuakeList
            break
        case COVERAGE_A_LIMIT:
            var coverageALimit = dynamicListMapper(propDetail,COVERAGE_A_LIMIT)
            response.CoverageLimit = coverageALimit
            break
        case BASE_FLOOD_ELEVATION:
            var baseFloodElevation = dynamicListMapper(propDetail,BASE_FLOOD_ELEVATION)
            response.BaseFloodElevation = baseFloodElevation
            break
        case CONDO_VALUATION_ID:
            var condoValuationID = dynamicListMapper(propDetail,CONDO_VALUATION_ID)
            response.CondoValuationID = condoValuationID
            break
        case FIRE_LINE_PROPERTY_HAZARD:
            var fireLinePropertyHazard = dynamicListMapper(propDetail,FIRE_LINE_PROPERTY_HAZARD)
            response.FireLinePropertyHazard = fireLinePropertyHazard
            break
        case METRICS_VERSION:
            var metricsVersion = dynamicListMapper(propDetail,METRICS_VERSION)
            response.MetricsVersion = metricsVersion
            break
        case PROPERTY_FLOOD:
            var propertyFlood = dynamicListMapper(propDetail,PROPERTY_FLOOD)
            response.PropertyFlood = propertyFlood
            break
        case ACV:
            var acv = dynamicListMapper(propDetail,ACV)
            response.ACV = acv
            break
        case FIRE_LINE_SHIA:
            var fireLineSHIA = dynamicListMapper(propDetail,FIRE_LINE_SHIA)
            response.FireLineSHIA = fireLineSHIA
            break

      }
    }


    return response
  }

  private function dynamicListMapper(propDetail: ArrayOfPropertyDatumModel_PropertyDatumModel, value : String): ArrayList<PropertyDataModel> {
    var list = new ArrayList<PropertyDataModel>()
    if (propDetail.ListValue.PropertyDatumModel.Count >= 1) {
      for (lValue in propDetail.ListValue.PropertyDatumModel) {
        var propertyDataModelResponse = new PropertyDataModel()
        propertyDataModelResponse.Value = mapPropertyDataModelValue(value,lValue.Value)
        propertyDataModelResponse.Percent = lValue.Percent
        propertyDataModelResponse.NamedValue = lValue.NamedValue
        list.add(propertyDataModelResponse)
      }
    }
    else {
      var propertyDataModelResponse = new PropertyDataModel()
      propertyDataModelResponse.Value = mapPropertyDataModelValue(value,propDetail.Value)
      propertyDataModelResponse.Percent = propDetail.Percent
      propertyDataModelResponse.NamedValue = propDetail.NamedValue
      list.add(propertyDataModelResponse)
    }
    return list
  }



  function mapPropertyDataModelValue(value : String, dataNumValue : String): String {

    //type list translations

      switch (value) {

        case STORIES_NUMBER:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("NumberOfStories_HOE", "tuna", dataNumValue)
            return typeValue

        case CONSTRUCTION_TYPE:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("ConstructionType_HOE", "tuna", dataNumValue)
            return typeValue

        case EXTERIOR_WALL_FINISH:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("ExteriorWallFinish_Ext", "tuna", dataNumValue)
            return typeValue

        case ROOF_COVER:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("RoofType", "tuna", dataNumValue)
            return typeValue

        case ROOF_TYPE:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("RoofShape_Ext", "tuna", dataNumValue)
            return typeValue

        case DISTANCE_TO_COAST:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("DistToCoastOverridden_Ext", "tuna", dataNumValue)
            return typeValue

        case DISTANCE_TO_MAJOR_BOW:
            var typeValue  = typeCodeMapper.getInternalCodeByAlias("DistBOWOverridden_Ext", "tuna", dataNumValue)
            return typeValue
       }
     return dataNumValue
  }
}