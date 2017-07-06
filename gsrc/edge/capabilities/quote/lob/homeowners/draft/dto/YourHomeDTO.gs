package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.TypeKeyIn
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses edge.capabilities.quote.draft.annotation.TunaValue
uses java.lang.Integer
uses java.util.Date

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
  @TunaValue(HOLocation_HOE#DwellingProtectionClasscode, HOLocation_HOE#DwellingPCCodeMatchLevel_Ext, HOLocation_HOE#OverrideDwellingPCCode_Ext, HOLocation_HOE#DwellingPCCodeOverridden_Ext, Dwelling_HOE#HOLocation)
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
  @TunaValue(HOLocation_HOE#ResFireDept_Ext, HOLocation_HOE#ResFireDeptMatchLevel_Ext, HOLocation_HOE#OverrideResFireDept_Ext, HOLocation_HOE#ResFireDeptOverridden_Ext, Dwelling_HOE#HOLocation)
  var _respondingFireDept : TunaValueDTO as RespondingFireDept


  @JsonProperty @Required
  @TunaValue(HOLocation_HOE#TerritoryCodeTunaReturned_Ext, HOLocation_HOE#TerritoryCodeMatchLevel_Ext, HOLocation_HOE#OverrideTerritoryCode_Ext, HOLocation_HOE#TerritoryCodeOverridden_Ext, Dwelling_HOE#HOLocation)
  var territoryCodeTunaReturned_Ext : TunaValueDTO as TerritoryCodeTunaReturned_Ext

  @JsonProperty
  private var _builderWarranty : Boolean as BuilderWarranty

  @JsonProperty
  private var _baseFloodElevationLevel : AbveBlwBaseFldElvtn_Ext as BaseFloodElevationLevel

  @JsonProperty
  private var _multiPolicyDiscount : Boolean as MultiPolicyDiscount

  @JsonProperty
  private var _insuredTenantDiscount : Boolean as InsuredTenantDiscount

  @JsonProperty
  private var _protectedSubdivision : Boolean as ProtectedSubdivision

  @JsonProperty
  private var _subdivisionName : typekey.SubdivisionName_Ext as SubdivisionName

  @JsonProperty
  private var _firePolicyNumber : String as FirePolicyNumber

  @JsonProperty
  private var _floodPolicyNumber : String as FloodPolicyNumber

  @JsonProperty
  private var _homeownersPolicyNumber : String as HomeownersPolicyNumber

  @JsonProperty
  private var _unitsBetweenFirewalls : Integer as NumberOfUnitsBetweenFirewalls

  @JsonProperty
  private var _isDwellingEverRented : Boolean as IsRentedToOthers

  @JsonProperty
  private var _isNewPurchase : Boolean as IsNewPurchase

  @JsonProperty
  private var _purchaseDateNew : Date as PurchaseDateNew

  @JsonProperty
  private var _purchaseDateOld : String as PurchaseDateOld

  @JsonProperty
  private var _moveInDate : String as MoveInDate

  @JsonProperty
  private var _priorResidenceType : typekey.PriorResidenceWas_Ext as PriorResidenceType

  @JsonProperty
  private var _isPostFirm : Boolean as IsPostFirm


  //Flood Coverage-related fields
  @JsonProperty
  private var _priorFloodInsuranceProvider : PriorFloodInsProvider_Ext as PriorFloodInsuranceProvider

  @JsonProperty
  private var _priorFloodInsuranceExpirationDate : Date as PriorFloodInsuranceExpirationDate

  @JsonProperty
  private var _floodCoverageBasement : Boolean as HasBasementForFloodCoverage

  @JsonProperty
  private var _isLocatedOnBarrierIsland : Boolean as IsOnBarrierIsland

  @JsonProperty
  private var _isPropertyInNonNFIPCommunity : Boolean as IsPropertyInNonNFIPCommunity

  @JsonProperty
  private var _hasPropertyEverSustainedFloodDamage : Boolean as HasPropertyEverSustainedFloodDamage

  @JsonProperty
  private var _elevatedRiskCredit : Boolean as ElevatedRiskCredit

  //Earthquake coverage-related fields
  @JsonProperty
  private var _hasPreExistingEarthquakeDamage : PreExstngEarthqukeDmg_Ext as HasPreExistingDamage_EQCoverage

  @JsonProperty
  private var _isBuiltOnSteepGrade_EQCoverage : Boolean as IsBuiltOnSteepGrade_EQCoverage

  @JsonProperty
  private var _isDwellingBolted_EQCoverage : Boolean as IsDwellingBolted_EQCoverage

  @JsonProperty
  private var _hasCrippleWalls_EQCoverage : Cripplewalls_Ext as HasCrippleWalls_EQCoverage

  @JsonProperty
  private var _isHotWaterHeaterSecured : Boolean as IsHotWaterHeaterSecured_EQCoverage

  @JsonProperty
  private var _isMasonryChimneyStrapped : Masonrychimney_Ext as IsMasonryChimneyStrapped_EQCoverage

  @JsonProperty
  private var _construction_EQCoverage : EarthquakeConstrn_Ext as Construction_EQCoverage

}
