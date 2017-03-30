package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses java.lang.Integer
uses edge.aspects.validation.annotations.Required
uses edge.capabilities.quote.lob.homeowners.draft.metadata.DetailOf
uses edge.capabilities.quote.lob.homeowners.draft.metadata.UpgradeYear
uses edge.aspects.validation.annotations.FilterBy
uses edge.aspects.validation.annotations.Year
uses edge.capabilities.quote.lob.homeowners.draft.metadata.NotAFutureYear

/**
 * Additional building details for the Construction page.
 */
class ConstructionDTO {
  @JsonProperty
  @Required
  @Year
  @NotAFutureYear
  var _yearBuilt : int as YearBuilt


  /** Reference to number of stories in this building. */
  @JsonProperty
  @Required
  var _storiesNumber : NumberOfStories_HOE as StoriesNumber



  /** Type of garage on this building. */
  @JsonProperty
  @Required
  var _hasGarage : boolean as HasGarage



  /** Type of the construction of this building. */
  @JsonProperty
  @Required
  var _constructionType : ConstructionType_HOE as ConstructionType

  @JsonProperty
  @DetailOf("ConstructionType", ConstructionType_HOE.TC_OTHER)
  var _constructionTypeDescription : String as ConstructionTypeDescription



  /** Type of the roof. */
  @JsonProperty
  @Required
  @FilterBy("HOSpecific")
  var _roofType : RoofType as RoofType

  @JsonProperty
  @DetailOf("RoofType", RoofType.TC_OTHER)
  var _roofTypeDescription : String as RoofTypeDescription

  @JsonProperty
  var _roofUpgradeExists : Boolean as RoofUpgradeExists

  @JsonProperty
  @UpgradeYear("RoofUpgradeExists")
  var _roofUpgradeYear : Integer as RoofUpgradeYear



  @JsonProperty
  @Required
  var _foundationType : FoundationType_HOE as FoundationType



  /** Type of primary heating. */
  @JsonProperty
  @Required
  var _primaryHeatingType : HeatingType_HOE as PrimaryHeatingType

  /** Type of primary heating. */
 /* @JsonProperty
  @DetailOf("PrimaryHeatingType", HeatingType_HOE.TC_NONE_EXT)//TC_OTHER  --Portal
  var _primaryHeatingTypeDescription : String as PrimaryHeatingTypeDescription
*/
  @JsonProperty
  @Required
  var _secondaryHeatingExists : boolean as SecondaryHeatingExists

  @JsonProperty
  var _heatingUpgradeExists : Boolean as HeatingUpgradeExists

  @JsonProperty
  @UpgradeYear("HeatingUpgradeExists")
  var _heatingUpgradeYear : Integer as HeatingUpgradeYear


  /** Type of plumbing in the building. */
  @JsonProperty
  @Required
  var _plumbingType : PlumbingType_HOE as PlumbingType

  @JsonProperty
  @DetailOf("PlumbingType", PlumbingType_HOE.TC_OTHER)
  var _plumbingTypeDescription : String as PlumbingTypeDescription

  @JsonProperty
  var _plumbingUpgradeExists : Boolean as PlumbingUpgradeExists

  @JsonProperty
  @UpgradeYear("PlumbingUpgradeExists")
  var _plumbingUpgradeYear : Integer as PlumbingUpgradeYear


  /** Type of wiring in the building. */
  @JsonProperty
  @Required
  var _wiringType : WiringType_HOE as WiringType

  @JsonProperty
  @DetailOf("WiringType", WiringType_HOE.TC_OTHER)
  var _wiringTypeDescription : String as WiringTypeDescription

  @JsonProperty
  var _wiringUpgradeExists : Boolean as WiringUpgradeExists

  @JsonProperty
  @UpgradeYear("WiringUpgradeExists")
  var _wiringUpgradeYear : Integer as WiringUpgradeYear


  /** Electrical type of the building. */
  @JsonProperty
  @Required
  var _electricalType : BreakerType_HOE as ElectricalType

  /*@JsonProperty
  @DetailOf("ElectricalType", BreakerType_HOE.TC_FUSE_EXT)  //TC_OTHER   --Portal
  var _electricalTypeDescription : String as ElectricalTypeDescription*/
}
