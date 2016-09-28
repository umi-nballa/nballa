package una.integration.mapping.hpx.homeowners

uses gw.xml.XmlElement
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 9:54 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXHODwellConstructionMapper {

  function createDwellConstruction(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType {
    var construction = new wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType()
    construction.YearBuilt.Year = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt != null ? policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt : ""
    //construction.addChild(new XmlElement("Construction", createConstructionCd(policyPeriod)))
    construction.ConstructionCd = createConstructionCd(policyPeriod) != null ? createConstructionCd(policyPeriod) : ""
    construction.Description = policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.Description : ""
    construction.NumStories = policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber != null ? policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber : ""
    construction.BldgArea.NumUnits = policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage : 0
    construction.BldgArea.UnitMeasurementCd = "Sqft"
    construction.addChild(new XmlElement("RoofingMaterial", createRoofingMaterial(policyPeriod)))
    construction.InsurerConstructionClassCd = policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode : ""
    return construction
  }

  function createRoofingMaterial(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.RoofingMaterialType {
    var roofingMaterial = new wsi.schema.una.hpx.hpx_application_request.types.complex.RoofingMaterialType()
    roofingMaterial.RoofMaterialCd = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.RoofType : ""
    roofingMaterial.RoofMaterialDesc = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.RoofType.Description : ""
    return roofingMaterial
  }

  function createConstructionCd(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType {
    var constructionCd = new wsi.schema.una.hpx.hpx_application_request.types.complex.ConstructionType()
    constructionCd.ConstructionCd = policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType : ""
    return constructionCd
  }
}