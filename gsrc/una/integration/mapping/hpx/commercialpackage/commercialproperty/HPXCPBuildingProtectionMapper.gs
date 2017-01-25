package una.integration.mapping.hpx.commercialpackage.commercialproperty
/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/14/16
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPBuildingProtectionMapper {

  function createBuildingProtection(bldg : CPBuilding) : wsi.schema.una.hpx.hpx_application_request.types.complex.BldgProtectionType {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.types.complex.BldgProtectionType()
    bldgProtection.ProtectionDeviceBurglarInd = bldg.Building.BurglarySafeguard != null ? true : false
    bldgProtection.ProtectionDeviceBurglarCd = bldg.Building.BurglarySafeguard != null ? "CEN" : ""
    bldgProtection.ProtectionDeviceSprinklerInd = bldg.Building.SprinklerCoverage != null ? true : false  // has sprinkler coverage... might need to add the percentage
    bldgProtection.FireProtectionClassCd = bldg.FirePCCodeOverridden_Ext != null ? bldg.FirePCCodeOverridden_Ext : bldg.FireProtectionClassCode
    bldgProtection.BCEG = bldg.OverrideBCEG_Ext != null ? bldg.OverrideBCEG_Ext : bldg.BCEG_Ext
    return bldgProtection
  }
}