package edge.capabilities.policychange.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.TypeKeyIn
uses edge.aspects.validation.annotations.Range

class DwellingDTO {

  /** Collection of additional interests for this dwelling */
  @JsonProperty
  var _additionalInterests : DwellingAdditionalInterestDTO [] as AdditionalInterests

  /** Distance from this dwelling to a fire hydrant */
  @JsonProperty @Required
  var _distToFireHydrant : int as DistanceToFireHydrant

  /** Distance from this dwelling to a fire station */
  @JsonProperty @Required
  var _distToFireStation : int as DistanceToFireStation

  /** Is this dwelling near commercial property */
  @JsonProperty @Required
  var _nearCommercial : boolean as NearCommercial

  /** The type of residence */
  @JsonProperty @Required
  @TypeKeyIn({
      typekey.ResidenceType_HOE.TC_CONDO,  //fam1
      typekey.ResidenceType_HOE.TC_DIYCONSTRUCTION_EXT,  //fam2
      typekey.ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT, //townrow
      typekey.ResidenceType_HOE.TC_MOBILEHOME_EXT  //mobile
  })
  var _residenceType : typekey.ResidenceType_HOE as ResidenceType

  /** Location of the dwelling */
  @JsonProperty @Required
  var _dwellingLocation : typekey.DwellingLocationType_HOE as DwellingLocation

  /** Is this dwelling a flood or fire hazard */
  @JsonProperty @Required
  var _floodingOrFireHazard : boolean as FloodingOrFireHazard

  /** What is the dwelling used for */
  @JsonProperty @Required
  var _dwellingUseage :  typekey.DwellingUsage_HOE as DwellingUsage

  /** The type of occupancy of the dwelling */
  @JsonProperty @Required
  var _occupancy : typekey.DwellingOccupancyType_HOE  as Occupancy
}
