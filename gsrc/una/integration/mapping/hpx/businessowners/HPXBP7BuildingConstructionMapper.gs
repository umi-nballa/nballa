package una.integration.mapping.hpx.businessowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 9:54 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingConstructionMapper {

  function createBuildingConstructionInfo(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.Construction {
    var construction = new wsi.schema.una.hpx.hpx_application_request.Construction()
    var yearBuilt =  new wsi.schema.una.hpx.hpx_application_request.YearBuilt()
    if (bldg.YearBuilt_Ext != null) {
      yearBuilt.setText(bldg.YearBuilt_Ext)
      construction.addChild(yearBuilt)
    }
    construction.addChild(createConstructionCd(bldg))

    var constructionTypeDesc = new wsi.schema.una.hpx.hpx_application_request.Description()
    if(bldg.ConstructionType != null) {
      constructionTypeDesc.setText(bldg.ConstructionType.Description)
      construction.addChild(constructionTypeDesc)
    }

    var numStories = new wsi.schema.una.hpx.hpx_application_request.NumStories()
    if (bldg.NoOfStories_Ext != null) {
      numStories.setText(bldg.NoOfStories_Ext)
      construction.addChild(numStories)
    }
    var bldgArea = new wsi.schema.una.hpx.hpx_application_request.BldgArea()
    var numUnits = new wsi.schema.una.hpx.hpx_application_request.NumUnits()
    var unitMeasurementCd = new wsi.schema.una.hpx.hpx_application_request.UnitMeasurementCd()
    if (bldg.BuildingSqFootage_Ext) {
       numUnits.setText(bldg.BuildingSqFootage_Ext)
       unitMeasurementCd.setText("Sqft")
      bldgArea.addChild(numUnits)
      bldgArea.addChild(unitMeasurementCd)
    }
    construction.addChild(bldgArea)

    var constructionClassCode = new wsi.schema.una.hpx.hpx_application_request.InsurerConstructionClassCd()
    if(bldg.BuildingClassCode != null) {
      constructionClassCode.setText(bldg.BuildingClassCode)
      construction.addChild(constructionClassCode)
    }

    return construction
  }


  function createConstructionCd(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.ConstructionCd {
    var constructionCd = new wsi.schema.una.hpx.hpx_application_request.ConstructionCd()
    if(bldg.ConstructionType != null) {
      switch (bldg.ConstructionType) {
        case typekey.BP7ConstructionType.TC_MASONRYNONCOMBUSTIBLE :
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.ConPour)
          break
        case typekey.BP7ConstructionType.TC_FRAMECONSTRUCTION :
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Frame)
          break
        case typekey.BP7ConstructionType.TC_JOISTEDMASONRY :
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Log)
          break
        case typekey.BP7ConstructionType.TC_JOISTEDMASONRY:
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Steel)
          break
        case typekey.BP7ConstructionType.TC_MASONRYNONCOMBUSTIBLE:
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Masonry)
          break
        default : constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.OT)
       }
    }
    return constructionCd
  }
}