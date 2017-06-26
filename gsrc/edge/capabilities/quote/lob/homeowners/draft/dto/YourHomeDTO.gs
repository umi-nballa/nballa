package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.TypeKeyIn
uses edge.aspects.validation.annotations.Range
uses edge.aspects.validation.annotations.Year
uses edge.capabilities.quote.lob.homeowners.draft.metadata.NotAFutureYear
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses edge.capabilities.quote.draft.annotation.TunaValue

class YourHomeDTO {

  @JsonProperty @Required
  var clueHit_Ext : boolean as ClueHit_Ext

  @JsonProperty @Required
  var creditStatus : CreditStatusExt as CreditStatus

  @JsonProperty @Required
  var _distToFireHydrant : int as DistanceToFireHydrant

  @JsonProperty @Required
  var _distToFireStation : int as DistanceToFireStation

  @JsonProperty @Required
  var _dwellingLocation : typekey.DwellingLocationType_HOE as DwellingLocation

  @JsonProperty @Required
  @TunaValue(HOLocation_HOE#DwellingProtectionClasscode, HOLocation_HOE#DwellingPCCodeMatchLevel_Ext, HOLocation_HOE#OverrideDwellingPCCode_Ext, HOLocation_HOE#DwellingPCCodeOverridden_Ext)
  var _dwellingProtectionClasscode : TunaValueDTO as DwellingProtectionClasscode

  @JsonProperty @Required
  var _dwellingUseage :  typekey.DwellingUsage_HOE as DwellingUsage

  @JsonProperty @Required
  var firstTimeDeededHome_Ext : boolean as FirstTimeDeededHome_Ext

  @JsonProperty @Required
  var _floodingOrFireHazard : boolean as FloodingOrFireHazard

  @JsonProperty @Required
  var _nearCommercial : boolean as NearCommercial

  @JsonProperty @Required
  var _occupancy : typekey.DwellingOccupancyType_HOE  as Occupancy

  @JsonProperty @Required
  @TypeKeyIn({
      typekey.ResidenceType_HOE.TC_CONDO,  //fam1
      typekey.ResidenceType_HOE.TC_DIYCONSTRUCTION_EXT,  //fam2
      typekey.ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT, //townrow
      typekey.ResidenceType_HOE.TC_MOBILEHOME_EXT  //mobile
  })
  var _residenceType : typekey.ResidenceType_HOE as ResidenceType

  @JsonProperty @Required
  @TunaValue(HOLocation_HOE#ResFireDept_Ext, HOLocation_HOE#ResFireDeptMatchLevel_Ext, HOLocation_HOE#OverrideResFireDept_Ext, HOLocation_HOE#ResFireDeptOverridden_Ext)
  var _respondingFireDept : TunaValueDTO as RespondingFireDept


  @JsonProperty @Required
  @TunaValue(HOLocation_HOE#TerritoryCodeTunaReturned_Ext, HOLocation_HOE#TerritoryCodeMatchLevel_Ext, HOLocation_HOE#OverrideTerritoryCode_Ext, HOLocation_HOE#TerritoryCodeOverridden_Ext)
  var territoryCodeTunaReturned_Ext : TunaValueDTO as TerritoryCodeTunaReturned_Ext


}
