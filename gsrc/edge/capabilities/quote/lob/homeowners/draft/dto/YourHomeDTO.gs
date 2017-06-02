package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.TypeKeyIn
uses edge.aspects.validation.annotations.Range

class YourHomeDTO {

  @JsonProperty @Required
  var _distToFireHydrant : int as DistanceToFireHydrant

  @JsonProperty @Required
  var _distToFireStation : int as DistanceToFireStation

  @JsonProperty @Required
  var _nearCommercial : boolean as NearCommercial

  @JsonProperty @Required
  @TypeKeyIn({
      typekey.ResidenceType_HOE.TC_CONDO,  //fam1
      typekey.ResidenceType_HOE.TC_DIYCONSTRUCTION_EXT,  //fam2
      typekey.ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT, //townrow
      typekey.ResidenceType_HOE.TC_MOBILEHOME_EXT  //mobile
  })
  var _residenceType : typekey.ResidenceType_HOE as ResidenceType

  @JsonProperty @Required
  var _dwellingLocation : typekey.DwellingLocationType_HOE as DwellingLocation

  @JsonProperty @Required
  var _floodingOrFireHazard : boolean as FloodingOrFireHazard

  @JsonProperty @Required
  var _dwellingUseage :  typekey.DwellingUsage_HOE as DwellingUsage

  @JsonProperty @Required
  var _occupancy : typekey.DwellingOccupancyType_HOE  as Occupancy

  @JsonProperty @Required
  var creditStatus : String as CreditStatus
  @JsonProperty @Required
  var firstTimeDeededHome_Ext : boolean as FirstTimeDeededHome_Ext
  @JsonProperty @Required
  var clueHit_Ext : boolean as ClueHit_Ext
  @JsonProperty @Required
  var dwellingProtectionClasscode : int as DwellingProtectionClasscode
  @JsonProperty @Required
  var territoryCodeTunaReturned_Ext : int as TerritoryCodeTunaReturned_Ext

}
