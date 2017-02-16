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
    construction.YearBuilt.Year = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext != null ? policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOverridden_Ext :
                        policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt != null ? policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt : ""
    construction.YearBuilt.setMonth(1)
    construction.YearBuilt.setDay(1)
    construction.ConstructionCd = policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext : policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType
    construction.Description = policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ConstTypeOverridden_Ext.Description : policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionType.Description
    construction.NumStories = policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber != null ? policyPeriod.HomeownersLine_HOE.Dwelling.StoriesNumber : 0
    construction.BldgArea.NumUnits = policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ApproxSquareFootage : 0
    construction.BldgArea.UnitMeasurementCd = "Sqft"
    construction.addChild(new XmlElement("RoofingMaterial", createRoofingMaterial(policyPeriod)))
    construction.InsurerConstructionClassCd = policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ConstructionCode : ""
    return construction
  }

  function createRoofingMaterial(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.RoofingMaterialType {
    var roofingMaterial = new wsi.schema.una.hpx.hpx_application_request.types.complex.RoofingMaterialType()
    roofingMaterial.RoofMaterialCd = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.RoofType : typekey.RoofType.TC_OTHER
    roofingMaterial.RoofMaterialDesc = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.RoofType.Description : ""
    return roofingMaterial
  }
}