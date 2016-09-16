package una.integration.mapping.hpx.commercialpackage.commercialproperty
/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 1:47 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPBuildingConstructionMapper {

  function createBuildingConstructionInfo(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.Construction {
    var construction = new wsi.schema.una.hpx.hpx_application_request.Construction()
    var yearBuilt =  new wsi.schema.una.hpx.hpx_application_request.YearBuilt()
    if (bldg.Building.YearBuilt != null) {
      yearBuilt.setText(bldg.Building.YearBuilt)
      construction.addChild(yearBuilt)
    }
    var constructionCd = new wsi.schema.una.hpx.hpx_application_request.ConstructionCd()
    var constructionTypeDesc = new wsi.schema.una.hpx.hpx_application_request.Description()
    if(bldg.Building.ConstructionType != null) {
      constructionCd.setText(bldg.Building.ConstructionType.Code)
      constructionTypeDesc.setText(bldg.Building.ConstructionType.Description)
      construction.addChild(constructionCd)
      construction.addChild(constructionTypeDesc)
    }

    var numStories = new wsi.schema.una.hpx.hpx_application_request.NumStories()
    if (bldg.Building.NumStories != null) {
      numStories.setText(bldg.Building.NumStories)
      construction.addChild(numStories)
    }

    var numBasements = new wsi.schema.una.hpx.hpx_application_request.NumBasements()
    if (bldg.Building.NumBasements != null) {
      numBasements.setText(bldg.Building.NumBasements)
      construction.addChild(numBasements)
    }

    var bldgArea = new wsi.schema.una.hpx.hpx_application_request.BldgArea()
    var baseArea = new wsi.schema.una.hpx.hpx_application_request.BasementArea()
    var numUnits = new wsi.schema.una.hpx.hpx_application_request.NumUnits()
    var unitMeasurementCd = new wsi.schema.una.hpx.hpx_application_request.UnitMeasurementCd()
    if (bldg.Building.TotalArea) {
      numUnits.setText(bldg.Building.TotalArea)
      unitMeasurementCd.setText("Sqft")
      bldgArea.addChild(numUnits)
      bldgArea.addChild(unitMeasurementCd)
    }
    construction.addChild(bldgArea)
    if(bldg.Building.BasementArea) {
      baseArea.setText(bldg.Building.BasementArea)
      unitMeasurementCd.setText("Sqft")
      baseArea.addChild(numUnits)
      baseArea.addChild(unitMeasurementCd)
    }
    construction.addChild(baseArea)

    var constructionClassCode = new wsi.schema.una.hpx.hpx_application_request.InsurerConstructionClassCd()
    if(bldg.ClassCode != null) {
      constructionClassCode.setText(bldg.ClassCode.Code)
      construction.addChild(constructionClassCode)
    }

    return construction
  }
}