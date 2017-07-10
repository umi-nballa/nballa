package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/6/17
 * Time: 9:07 AM
 * To change this template use File | Settings | File Templates.
 */
class YourHomeProtectionDTO {

  @JsonProperty
  var _hasSmokeAlarm : Boolean as HasSmokeAlarm

  @JsonProperty
  var _hasFireAlarm : Boolean as HasFireAlarm

  @JsonProperty
  var _hasBurglarAlarm : Boolean as HasBurglarAlarm

  @JsonProperty
  var _hasFireExtinguishers : Boolean as HasFireExtinguishers

  @JsonProperty
  var _hasDeadbolts : Boolean as HasDeadbolts

  @JsonProperty
  var _hasFireAlarmCentralStationReporting : Boolean as HasFireAlarmCentralStationReporting

  @JsonProperty
  var _hasBurglarAlarmCentralStationReporting : Boolean as HasBurglarAlarmCentralStationReporting

  @JsonProperty
  var _hasBurglarAlarmPoliceStationReporting : Boolean as HasBurglarAlarmPoliceStationReporting

  @JsonProperty
  var _hasFireAlarmFireStationReporting : Boolean as HasFireAlarmFireStationReporting

  @JsonProperty
  var _hasFireAlarmPoliceStationReporting : Boolean as HasFireAlarmPoliceStationReporting

  @JsonProperty
  var _hasCompleteSprinklerSystem : Boolean as HasCompleteSprinklerSystem

  @JsonProperty
  var _hasAutoSprinklerSystem : Boolean as HasAutoSprinklerSystem

  @JsonProperty
  var _hasGatedCommunity : Boolean as HasGatedCommunity

}