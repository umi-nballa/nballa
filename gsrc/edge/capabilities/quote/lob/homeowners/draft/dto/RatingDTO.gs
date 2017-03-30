package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.capabilities.quote.lob.homeowners.draft.metadata.DetailOf
uses java.lang.Integer
uses edge.aspects.validation.annotations.FilterByCategory
uses edge.el.Expr

/**
* Additional details for Rating screen
 */
class RatingDTO {
  /* REQUIRED FIELDS */
  @JsonProperty @Required
  var _fireExtinguishers : boolean as FireExtinguishers

  @JsonProperty @Required
  var _burglarAlarm : boolean as BurglarAlarm

  @JsonProperty @DetailOf("BurglarAlarm")
  var _burglarAlarmType : BurglarAlarmType_HOE as BurglarAlarmType

  @JsonProperty @Required
  var _fireAlarm : boolean as FireAlarm

  @JsonProperty @Required
  var _smokeAlarm : boolean as SmokeAlarm

  @JsonProperty @DetailOf("SmokeAlarm")
  var _smokeAlarmOnAllFloors : Boolean as SmokeAlarmOnAllFloors

  @JsonProperty @Required
  var _deadbolts : boolean as Deadbolts

  @JsonProperty @DetailOf("Deadbolts")
  var _deadboltsNumber : Integer as DeadboltsNumber

  @JsonProperty @Required
  var _visibleToNeighbors : boolean as VisibleToNeighbors

  @JsonProperty @Required
  var _sprinklerSystemType : SprinklerSystemType_HOE as SprinklerSystemType
  /* OPTIONAL FIELDS */
  @JsonProperty
  var _roomerBoarders : Boolean as RoomerBoarders

  @JsonProperty @DetailOf("RoomerBoarders")
  var _roomerBoardersNumber : Integer as RoomerBoardersNumber

  @JsonProperty
  @FilterByCategory(Expr.const(HOPolicyType_HOE.TC_HO3))
  var _unitsNumber : NumUnits_HOE as UnitsNumber

  @JsonProperty
  var _fireplaceOrWoodStoveExists : Boolean as FireplaceOrWoodStoveExists

  @JsonProperty @DetailOf("FireplaceOrWoodStoveExists")
  var _fireplaceOrWoodStovesNumber : Integer as FireplaceOrWoodStovesNumber

  @JsonProperty
  var _swimmingPoolExists : Boolean as SwimmingPoolExists

  @JsonProperty @DetailOf("SwimmingPoolExists")
  var _swimmingPoolFencing : Boolean as SwimmingPoolFencing

  @JsonProperty @DetailOf("SwimmingPoolExists")
  var _swimmingPoolDivingBoard : Boolean as SwimmingPoolDivingBoard

  @JsonProperty
  var _trampolineExists : Boolean as TrampolineExists

  @JsonProperty @DetailOf("TrampolineExists")
  var _trampolineSafetyNet : Boolean as TrampolineSafetyNet

  /** Flooding */
  @JsonProperty
  var _knownWaterLeakage : Boolean as KnownWaterLeakage

  @JsonProperty @DetailOf("KnownWaterLeakage")
  var _knownWaterLeakageDescription : String as KnownWaterLeakageDescription
}
