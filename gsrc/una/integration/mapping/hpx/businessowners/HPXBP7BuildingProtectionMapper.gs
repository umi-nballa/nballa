package una.integration.mapping.hpx.businessowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 7:30 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingProtectionMapper {

  function createBuildingProtection(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.types.complex.BldgProtectionType {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.types.complex.BldgProtectionType()
    bldgProtection.FireProtectionClassCd = bldg.DwellingProtectionClassCode != null ? bldg.DwellingProtectionClassCode : null
    bldgProtection.ProtectionDeviceBurglarInd = bldg.CentralBurglarAlarm_Ext != null ? bldg.CentralBurglarAlarm_Ext : false
    bldgProtection.ProtectionDeviceBurglarCd = bldg.CentralBurglarAlarm_Ext != null ? "CEN" : ""
    bldgProtection.ProtectionDeviceSprinklerInd = bldg.Sprinklered != null ? bldg.Sprinklered : false
    bldgProtection.ProtectionDeviceSprinklerCd = bldg.Sprinklered != null ? "Sprinkler" : ""
    bldgProtection.ProtectionDeviceFireInd = bldg.CentralFireAlarmSystem_Ext != null ? bldg.CentralFireAlarmSystem_Ext : false
    return bldgProtection
  }
}