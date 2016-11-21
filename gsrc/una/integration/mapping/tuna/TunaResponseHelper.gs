package una.integration.mapping.tuna

uses wsi.remote.una.tuna.quoteservice.types.complex.PropertyGeographyModel
uses java.util.ArrayList
uses wsi.remote.una.tuna.quoteservice.types.complex.ArrayOfPropertyDatumModel
uses wsi.remote.una.tuna.quoteservice.anonymous.elements.ArrayOfPropertyDatumModel_PropertyDatumModel

/**
 * Created with IntelliJ IDEA.
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
    var propertyModelDetails = tunaResponse.Datums.PropertyDatumModel

    for (propDetail in propertyModelDetails) {

      switch (propDetail.Id) {

        case BCEG:
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
            var proClassList = dynamicListMapper(propDetail)
            response.ProtectionClass = proClassList
            break
         //TODO complete the other datum mappings

      }
    }


    return response
  }

  private function dynamicListMapper(propDetail: ArrayOfPropertyDatumModel_PropertyDatumModel): ArrayList<String> {
    var list = new ArrayList<String>()
    if (propDetail.ListValue.PropertyDatumModel.Count >= 1) {
      for (lValue in propDetail.ListValue.PropertyDatumModel) {
        list.add(lValue.Value)
      }
    }
    else {
      list.add(propDetail.Value)
    }
    return list
  }
}