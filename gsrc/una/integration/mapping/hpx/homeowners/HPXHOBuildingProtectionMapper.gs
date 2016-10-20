package una.integration.mapping.hpx.homeowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/5/16
 * Time: 7:30 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXHOBuildingProtectionMapper {

  function createBuildingProtection(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.BldgProtectionType {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.types.complex.BldgProtectionType()
    bldgProtection.ProtectionClassGradeCd = policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode != null ?
                                                policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode : ""
    bldgProtection.ProtectionDeviceFireInd = policyPeriod.HomeownersLine_HOE.Dwelling.FireExtinguishers != null ?
                                                policyPeriod.HomeownersLine_HOE.Dwelling.FireExtinguishers : false
    bldgProtection.ProtectionDeviceFireCd = policyPeriod.HomeownersLine_HOE.Dwelling.SmokeAlarm != null ?
                                                "SMOKE" : ""
    bldgProtection.ProtectionDeviceFireDesc = policyPeriod.HomeownersLine_HOE.Dwelling.SmokeAlarmOnAllFloors != null ?
                                                "Smoke alarm on all floors" : "Smoke alarm not on all floors"
    bldgProtection.ProtectionDeviceBurglarInd = policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarm != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarm : false
    bldgProtection.ProtectionDeviceBurglarCd = policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType : null
    bldgProtection.ProtectionDeviceBurglarDesc = policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.BurglarAlarmType.Description : ""
    bldgProtection.ProtectionDeviceSprinklerCd = policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType : null
    bldgProtection.ProtectionDeviceSprinklerDesc = policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType != null ?
                                                    policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType.Description : ""
    bldgProtection.ProtectionDeviceSprinklerInd = policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType != typekey.SprinklerSystemType_HOE.TC_NONE ?
                                                    policyPeriod.HomeownersLine_HOE.Dwelling.SprinklerSystemType : false
    return bldgProtection
  }
}