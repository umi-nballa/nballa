package una.integration.mapping.hpx.businessowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 9:54 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingConstructionMapper {

  function createBuildingConstructionInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Construction {
    var construction = new wsi.schema.una.hpx.hpx_application_request.Construction()
    var yearBuilt =  new wsi.schema.una.hpx.hpx_application_request.YearBuilt()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt != null) {
      yearBuilt.setText(policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt)
      construction.addChild(yearBuilt)
    }
    construction.addChild(createConstructionCd(policyPeriod))
    var constructionTypeDesc = new wsi.schema.una.hpx.hpx_application_request.Description()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType != null) {
      constructionTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.Description)
      construction.addChild(constructionTypeDesc)
    }
    var numStories = new wsi.schema.una.hpx.hpx_application_request.NumStories()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber != null) {
      numStories.setText(policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber)
      construction.addChild(numStories)
    }
    var bldgArea = new wsi.schema.una.hpx.hpx_application_request.BldgArea()
    var numUnits = new wsi.schema.una.hpx.hpx_application_request.NumUnits()
    var unitMeasurementCd = new wsi.schema.una.hpx.hpx_application_request.UnitMeasurementCd()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage) {
       numUnits.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage)
       unitMeasurementCd.setText("Sqft")
      bldgArea.addChild(numUnits)
      bldgArea.addChild(unitMeasurementCd)
    }
    construction.addChild(bldgArea)
    construction.addChild(createRoofingMaterial(policyPeriod))
    var constructionClassCode = new wsi.schema.una.hpx.hpx_application_request.InsurerConstructionClassCd()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode != null) {
      constructionClassCode.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode)
      construction.addChild(constructionClassCode)
    }

    return construction
  }

  function createRoofingMaterial(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.RoofingMaterial {
    var roofingMaterial = new wsi.schema.una.hpx.hpx_application_request.RoofingMaterial()
    var roofingMaterialCd = new wsi.schema.una.hpx.hpx_application_request.RoofMaterialCd()
    var roofingMaterialDesc = new wsi.schema.una.hpx.hpx_application_request.RoofMaterialDesc()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null) {
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.RoofType) {
        case typekey.RoofType.TC_COMP :
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.COMP)
            break
        case typekey.RoofType.TC_WOOD :
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.WOODSS)
            break
        case typekey.RoofType.TC_TARGRAVEL :
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.TARGRB)
            break
        case typekey.RoofType.TC_SLATE:
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.SLAT)
            break
        case typekey.RoofType.TC_TILECLAY:
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.TILECLAY)
            break
        case typekey.RoofType.TC_TILECONCRETE:
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.TILECONCRETE)
            break
        case typekey.RoofType.TC_FIBERCEMENT:
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.FIBERCEMENT)
            break
        case typekey.RoofType.TC_FIBERALUMINUM:
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.FIBERALUMINUM)
            break
        case typekey.RoofType.TC_COPPER:
            roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.OT)
            break
        // TODO Mapping
        default : roofingMaterialCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.RoofMaterialType.OT)
      }
      roofingMaterialDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.RoofType.Description)
      roofingMaterial.addChild(roofingMaterialCd)
      roofingMaterial.addChild(roofingMaterialDesc)
    }
    return roofingMaterial
  }

  function createConstructionCd(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.ConstructionCd {
    var constructionCd = new wsi.schema.una.hpx.hpx_application_request.ConstructionCd()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType != null) {
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType) {
        case typekey.ConstructionType_HOE.TC_C :
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.ConPour)
          break
        case typekey.ConstructionType_HOE.TC_F :
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Frame)
          break
        case typekey.ConstructionType_HOE.TC_L :
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Log)
          break
        case typekey.ConstructionType_HOE.TC_S:
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Steel)
          break
        case typekey.ConstructionType_HOE.TC_M:
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.Masonry)
          break
        case typekey.ConstructionType_HOE.TC_OTHER:
          constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.OT)
          break
        default : constructionCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ConstructionType.OT)
       }
    }
    return constructionCd
  }
}