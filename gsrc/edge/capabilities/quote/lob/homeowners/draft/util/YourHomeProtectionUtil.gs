package edge.capabilities.quote.lob.homeowners.draft.util

uses edge.capabilities.quote.draft.dto.BaseTunaValueUtil
uses edge.capabilities.quote.lob.homeowners.draft.dto.YourHomeProtectionDTO
uses java.lang.UnsupportedOperationException

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/6/17
 * Time: 10:22 AM
 * To change this template use File | Settings | File Templates.
 */
final class YourHomeProtectionUtil extends BaseTunaValueUtil{
    construct() {
      throw new UnsupportedOperationException("This is an utility class.")
    }

    /**
    * Fills Guidewire-provided properties on the dto.
    */
    public static function fillBaseProperties(dto : YourHomeProtectionDTO, data : Dwelling_HOE) {
      mapTunaFields(data, dto, YourHomeProtectionDTO, TO)
      dto.HasAutoSprinklerSystem = data.DwellingProtectionDetails.AutomaticSprinkler
      dto.HasCompleteSprinklerSystem = data.DwellingProtectionDetails.SprinklerSystemAllAreas
      dto.HasBurglarAlarm = data.DwellingProtectionDetails.BurglarAlarm
      dto.HasBurglarAlarmCentralStationReporting = data.DwellingProtectionDetails.BurglarAlarmReportCntlStn
      dto.HasBurglarAlarmPoliceStationReporting = data.DwellingProtectionDetails.BurglarAlarmReportPoliceStn
      dto.HasDeadbolts = data.DwellingProtectionDetails.Deadbolts
      dto.HasFireAlarm = data.DwellingProtectionDetails.FireAlarm
      dto.HasFireAlarmCentralStationReporting = data.DwellingProtectionDetails.FireAlarmReportCntlStn
      dto.HasFireAlarmPoliceStationReporting = data.DwellingProtectionDetails.FireAlarmReportPoliceStn
      dto.HasFireAlarmFireStationReporting = data.DwellingProtectionDetails.FireAlarmReportFireStn
      dto.HasFireExtinguishers = data.DwellingProtectionDetails.FireExtinguishers
      dto.HasGatedCommunity = data.DwellingProtectionDetails.GatedCommunity
      dto.HasSmokeAlarm = data.DwellingProtectionDetails.SmokeAlarm
    }

    /**
    * Updates base construction properties on the data if <code>dto</code> is not <code>null</code>.
    * If <code>dto</code> is <code>null</code> this method does nothing.
    */
    public static function updateFrom(data : Dwelling_HOE, dto : YourHomeProtectionDTO) {
      if (dto == null) {
        return
      }

      mapTunaFields(data, dto, YourHomeProtectionDTO, FROM)
      data.DwellingProtectionDetails.AutomaticSprinkler = dto.HasAutoSprinklerSystem
      data.DwellingProtectionDetails.SprinklerSystemAllAreas = dto.HasCompleteSprinklerSystem
      data.DwellingProtectionDetails.BurglarAlarm = dto.HasBurglarAlarm
      data.DwellingProtectionDetails.BurglarAlarmReportCntlStn = dto.HasBurglarAlarmCentralStationReporting
      data.DwellingProtectionDetails.BurglarAlarmReportPoliceStn = dto.HasBurglarAlarmPoliceStationReporting
      data.DwellingProtectionDetails.Deadbolts = dto.HasDeadbolts
      data.DwellingProtectionDetails.FireAlarm = dto.HasFireAlarm
      data.DwellingProtectionDetails.FireAlarmReportCntlStn = dto.HasFireAlarmCentralStationReporting
      data.DwellingProtectionDetails.FireAlarmReportPoliceStn = dto.HasFireAlarmPoliceStationReporting
      data.DwellingProtectionDetails.FireAlarmReportFireStn = dto.HasFireAlarmFireStationReporting
      data.DwellingProtectionDetails.FireExtinguishers = dto.HasFireExtinguishers
      data.DwellingProtectionDetails.GatedCommunity = dto.HasGatedCommunity
      data.DwellingProtectionDetails.SmokeAlarm = dto.HasSmokeAlarm
    }
}