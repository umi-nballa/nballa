package edge.capabilities.policy.coverages

uses edge.jsonmapper.JsonProperty
uses java.util.Date
uses edge.capabilities.address.dto.AddressDTO
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 5/25/17
 * Time: 6:03 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAScheduledItemDTO{
  @JsonProperty
  var _scheduleTypeCode : String as ScheduleTypeCode

  @JsonProperty
  var _description : String as Description

  @JsonProperty
  var _value : Integer as Value

  @JsonProperty
  var _waterCraftType : String as WatercraftTypeCode

  @JsonProperty
  var _overallLength : String as OverallLengthTypeCode

  @JsonProperty
  var _speedRating : String as SpeedRatingTypeCode

  @JsonProperty
  var _fromDate : Date as FromDate

  @JsonProperty
  var _toDate : Date as ToDate

  @JsonProperty
  var _motorDescription : String as MotorDescription

  @JsonProperty
  var _name : String as Name

  @JsonProperty
  var _address : AddressDTO as Address

  @JsonProperty
  var _horsePowerTypeCode : String as HorsePowerTypeCode

  @JsonProperty
  var _numberOfFamilies : Integer as NumberOfFamilies
}