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

  @JsonProperty @Required @Range(1, 2000000000)
  var _replacementCost : int as ReplacementCost

  //Below code added for additional Coverages and overcoming UW issues
  @JsonProperty @Required
  var hODW_Other_Structures_HOE : int as HODW_Other_Structures_HOE
  @JsonProperty @Required
  var hODW_Personal_Property_HOE : int as HODW_Personal_Property_HOE
  @JsonProperty @Required
  var hODW_Loss_Of_Use_HOE : int as HODW_Loss_Of_Use_HOE
  @JsonProperty @Required
  var hODW_CC_EFT_HOE_Ext : int as HODW_CC_EFT_HOE_Ext
  @JsonProperty @Required
  var hODW_FireDepartmentService_HOE_Ext : int as HODW_FireDepartmentService_HOE_Ext
  @JsonProperty @Required
  var hODW_HODebrisRemoval_HOE_Ext : int as HODW_HODebrisRemoval_HOE_Ext
  @JsonProperty @Required
  var hOPL_SpecialLimitDeductibleAssessment_HOETerm : String as HOPL_SpecialLimitDeductibleAssessment_HOETerm
  @JsonProperty @Required
  var hOPL_LossAssCovLimit_HOETerm : int as HOPL_LossAssCovLimit_HOETerm
  @JsonProperty @Required
  var hODW_TreesandPlantsLimit_HOETerm : int as HODW_TreesandPlantsLimit_HOETerm
  @JsonProperty @Required
  var hODW_TreesandPlantsMaxLimit_HOETerm : int as HODW_TreesandPlantsMaxLimit_HOETerm
  @JsonProperty @Required
  var hODW_Hurricane_Ded_HOETerm : int as HODW_Hurricane_Ded_HOETerm
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
