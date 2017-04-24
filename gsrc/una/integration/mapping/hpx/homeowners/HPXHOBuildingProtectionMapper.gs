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
                                                policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode : null
    bldgProtection.ProtectionDeviceFireInd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.FireExtinguishers != null ?
                                                policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.FireExtinguishers : false
    bldgProtection.ProtectionDeviceFireCd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SmokeAlarm != null ?
                                                "SMOKE" : ""
    bldgProtection.ProtectionDeviceFireDesc = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SmokeAlarmOnAllFloors != null ?
                                                "Smoke alarm on all floors" : "Smoke alarm not on all floors"
    bldgProtection.ProtectionDeviceBurglarInd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarm != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarm : false
    bldgProtection.ProtectionDeviceBurglarCd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarmType != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarmType : null
    bldgProtection.ProtectionDeviceBurglarDesc = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarmType != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarmType.Description : ""
    bldgProtection.ProtectionDeviceSprinklerCd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SprinklerSystemType != null ?
                                                  policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SprinklerSystemType : null
    bldgProtection.ProtectionDeviceSprinklerDesc = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SprinklerSystemType != null ?
                                                    policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SprinklerSystemType.Description : ""
    bldgProtection.ProtectionDeviceSprinklerInd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SprinklerSystemType != typekey.SprinklerSystemType_HOE.TC_NONE ?
                                                    policyPeriod.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.SprinklerSystemType : false
    bldgProtection.CityLimits = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingLocation == typekey.DwellingLocationType_HOE.TC_CITY ? true : false
    return bldgProtection
  }
}