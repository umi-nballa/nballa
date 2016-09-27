package una.integration.mapping.hpx.businessowners

uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 9:54 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingConstructionMapper {

  function createBuildingConstructionInfo(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType {
    var construction = new wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType()
    construction.YearBuilt.Year = bldg.YearBuilt_Ext != null ? bldg.YearBuilt_Ext : ""
    //construction.addChild(new XmlElement(createConstructionCd(bldg)))
    construction.ConstructionCd = createConstructionCd(bldg) != null ? createConstructionCd(bldg) : ""
    construction.Description = bldg.ConstructionType != null ? bldg.ConstructionType.Description : ""
    construction.NumStories = bldg.NoOfStories_Ext != null ? bldg.NoOfStories_Ext : 0
    construction.BldgArea.NumUnits = bldg.BuildingSqFootage_Ext != null ? bldg.BuildingSqFootage_Ext : 0
    construction.BldgArea.UnitMeasurementCd = "Sqft"
    construction.InsurerConstructionClassCd = bldg.BuildingClassCode != null ? bldg.BuildingClassCode : ""
    return construction
  }


  function createConstructionCd(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType  {
    var constructionCd = new wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType()
    constructionCd.ConstructionCd = bldg.ConstructionType != null ? bldg.ConstructionType : ""
    return constructionCd
  }
}