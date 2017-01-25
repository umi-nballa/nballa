package una.integration.mapping.hpx.commercialpackage.commercialproperty
/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 1:47 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPBuildingConstructionMapper {

  function createBuildingConstructionInfo(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType {
    var construction = new wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType()
    construction.YearBuilt.Year = bldg.Building.YearBuilt != null ? bldg.Building.YearBuilt : ""
    construction.ConstructionType = bldg.Building.ConstructionType != null ? bldg.Building.ConstructionType.Description : ""
    construction.NumStories = bldg.Building.NumStories != null ? bldg.Building.NumStories : 0
    construction.NumBasements = bldg.Building.NumBasements != null ? bldg.Building.NumBasements : 0
    construction.BldgArea.NumUnits = bldg.Building.TotalArea != null ? bldg.Building.TotalArea : 0
    construction.BldgArea.UnitMeasurementCd = "Sqft"
    construction.BasementArea.NumUnits = bldg.Building.BasementArea != null ? bldg.Building.BasementArea : 0
    construction.BasementArea.UnitMeasurementCd = "Sqft"
    return construction
  }
}