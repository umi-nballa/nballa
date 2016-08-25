package una.integration.mapping.hpx.businessowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 7:30 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7BuildingProtectionMapper {

  function createBuildingProtection(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.BldgProtection {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.BldgProtection()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode != null) {
      var protectionClassGradeCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionClassGradeCd()
      protectionClassGradeCd.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode)
      bldgProtection.addChild(protectionClassGradeCd)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.FireExtinguishers != null) {
      var fireExtinguisherInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceFireInd()
      if (policyPeriod.HomeownersLine_HOE.Dwelling.FireExtinguishers) {
        fireExtinguisherInd.setText(true)
      } else {
        fireExtinguisherInd.setText(false)
      }
      bldgProtection.addChild(fireExtinguisherInd)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.SmokeAlarm != null) {
      if (policyPeriod.HomeownersLine_HOE.Dwelling.SmokeAlarm) {
        var protectionDeviceFireCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceFireCd()
        protectionDeviceFireCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.SMOKE)
        bldgProtection.addChild(protectionDeviceFireCd)
      }
    }

    if (policyPeriod.HomeownersLine_HOE.Dwelling.SmokeAlarmOnAllFloors != null) {
      var protectionDeviceSmokeDesc = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceFireDesc()
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.SmokeAlarmOnAllFloors) {
        case true :
            protectionDeviceSmokeDesc.setText("Smoke alarm on all floors")
            break
        case false :
            protectionDeviceSmokeDesc.setText("Smoke alarm not on all floors")
            break
      }
      bldgProtection.addChild(protectionDeviceSmokeDesc)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarm != null) {
      var protectionDeviceBurglarInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarInd()
      protectionDeviceBurglarInd.setText(policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarm)
      bldgProtection.addChild(protectionDeviceBurglarInd)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType != null) {
      var protectionDeviceBurglarCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarCd()
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType) {
        case typekey.BurglarAlarmType_HOE.TC_CENTRAL :
            protectionDeviceBurglarCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.CEN)
            break
        case typekey.BurglarAlarmType_HOE.TC_POLICE :
            protectionDeviceBurglarCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.PC)
            break
        case typekey.BurglarAlarmType_HOE.TC_LOCAL :
            protectionDeviceBurglarCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.LO)
            break
        default : protectionDeviceBurglarCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.OT)
      }
      bldgProtection.addChild(protectionDeviceBurglarCd)
      var protectionDeviceBurglarDesc = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceBurglarDesc()
      protectionDeviceBurglarDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType.Description)
      bldgProtection.addChild(protectionDeviceBurglarDesc)
    }
    if (policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType != null) {
      var protectionDeviceSprinklerCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceSprinklerCd()
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType) {
        case typekey.SprinklerSystemType_HOE.TC_NONE :
            protectionDeviceSprinklerCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.NO)
            break
        case typekey.SprinklerSystemType_HOE.TC_FULL :
            protectionDeviceSprinklerCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.FU)
            break
        case typekey.SprinklerSystemType_HOE.TC_PARTIAL :
            protectionDeviceSprinklerCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.PT)
            break
        default : protectionDeviceSprinklerCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.ProtectionDevice.OT)
      }
      bldgProtection.addChild(protectionDeviceSprinklerCd)
      var protectionDeviceSprinklerDesc = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceSprinklerDesc()
      protectionDeviceSprinklerDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType.Description)
      bldgProtection.addChild(protectionDeviceSprinklerDesc)
      var protectionDeviceSprinklerInd = new wsi.schema.una.hpx.hpx_application_request.ProtectionDeviceSprinklerInd()
      if (policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType != typekey.SprinklerSystemType_HOE.TC_NONE) {
        protectionDeviceSprinklerInd.setText(true)
      } else {
        protectionDeviceSprinklerInd.setText(false)
      }
    }
    return bldgProtection
  }
}