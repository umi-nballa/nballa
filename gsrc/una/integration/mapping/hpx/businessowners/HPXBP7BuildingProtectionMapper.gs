package una.integration.mapping.hpx.businessowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 7:30 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingProtectionMapper {

  function createBuildingProtection(bldg : BP7Building) : wsi.schema.una.hpx.hpx_application_request.BldgProtection {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.BldgProtection()
    if(bldg.Location.FireProtectionClassPPC != null) {
      var fireProtectionClassCd = new wsi.schema.una.hpx.hpx_application_request.FireProtectionClassCd()
      fireProtectionClassCd.setText(bldg.Location.FireProtectionClassPPC)
      bldgProtection.addChild(fireProtectionClassCd)
    }
    if (bldg.CentralBurglarAlarm_Ext != null) {
      var protectionDeviceBurglarInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarInd()
      protectionDeviceBurglarInd.setText(bldg.CentralBurglarAlarm_Ext)
      bldgProtection.addChild(protectionDeviceBurglarInd)
      if(bldg.CentralBurglarAlarm_Ext) {
        var protectionDeviceBurglarCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarCd()
        protectionDeviceBurglarCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.CEN)
        bldgProtection.addChild(protectionDeviceBurglarCd)
      }
    }
    if (bldg.Sprinklered != null) {
      var protectionDeviceSprinklerInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceSprinklerInd()
      protectionDeviceSprinklerInd.setText(bldg.Sprinklered)
    }
    if (bldg.CentralFireAlarmSystem_Ext != null) {
      var protectionDeviceSprinklerInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceSprinklerInd()
      protectionDeviceSprinklerInd.setText(bldg.Sprinklered)
    }
    if (bldg.CentralFireAlarmSystem_Ext != null) {
      var fireExtinguisherInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceFireInd()
      fireExtinguisherInd.setText(bldg.CentralFireAlarmSystem_Ext)
      bldgProtection.addChild(fireExtinguisherInd)
    }
    return bldgProtection
  }
}