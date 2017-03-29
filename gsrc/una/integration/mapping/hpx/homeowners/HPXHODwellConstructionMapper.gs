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
    construction.addChild(new XmlElement("WindstormMitigation", createWindMitigation(policyPeriod)))
    return construction
  }

  function createRoofingMaterial(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.RoofingMaterialType {
    var roofingMaterial = new wsi.schema.una.hpx.hpx_application_request.types.complex.RoofingMaterialType()
    roofingMaterial.RoofMaterialCd = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.RoofType : typekey.RoofType.TC_OTHER
    roofingMaterial.RoofMaterialDesc = policyPeriod.HomeownersLine_HOE.Dwelling.RoofType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.RoofType.Description : ""
    return roofingMaterial
  }

  function createWindMitigation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.WindMitigationType {
    var windMitigation = new wsi.schema.una.hpx.hpx_application_request.types.complex.WindMitigationType()
    windMitigation.RoofDecking = policyPeriod.HomeownersLine_HOE.Dwelling.RoofDecking_Ext.Description
    windMitigation.OpeningProtection = policyPeriod.HomeownersLine_HOE.Dwelling.OpeningProtection_Ext.Description
    windMitigation.WindSpeed = policyPeriod.HomeownersLine_HOE.Dwelling.FBCWindSpeed_Ext.Description
    windMitigation.WindBorneDebrisRegion = policyPeriod.HomeownersLine_HOE.Dwelling.WindBorneDebrisRegion_Ext.Description
    windMitigation.InternalPressureDesign = policyPeriod.HomeownersLine_HOE.Dwelling.InternalPressureDsgn_Ext.Description
    windMitigation.SecondaryWaterResistance = policyPeriod.HomeownersLine_HOE.Dwelling.SecondaryWaterResis_Ext.Description
    windMitigation.RoofWallConnection = policyPeriod.HomeownersLine_HOE.Dwelling.RoofWallConnection_Ext.Description
    windMitigation.RoofCover = policyPeriod.HomeownersLine_HOE.Dwelling.RoofCover_Ext.Description
    windMitigation.RoofDeckAttachment = policyPeriod.HomeownersLine_HOE.Dwelling.RoofDeckAttachment_Ext.Description
    windMitigation.DoorStrength = policyPeriod.HomeownersLine_HOE.Dwelling.DoorStrength_Ext.Description
    windMitigation.Terrain = policyPeriod.HomeownersLine_HOE.Dwelling.Terrain_Ext.Description
    return windMitigation
  }
}