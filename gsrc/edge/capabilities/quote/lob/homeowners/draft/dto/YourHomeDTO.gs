package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses edge.capabilities.quote.draft.annotation.TunaValue
uses java.lang.Integer
uses java.util.Date
uses edge.aspects.validation.annotations.TypeKeyNotIn

class YourHomeDTO {

  @JsonProperty
  @TunaValue(HOLocation_HOE#ACVValue_Ext, HOLocation_HOE#ACVValueMatchLevel_Ext, HOLocation_HOE#OverrideACVValue_Ext, HOLocation_HOE#ACVValueOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _actualCashValue : TunaValueDTO as ActualCashValue

  @JsonProperty
  @TunaValue(Dwelling_HOE#BaseFloodElVal_Ext, Dwelling_HOE#BaseFloodElValMatchLevel_Ext, Dwelling_HOE#OverrideBaseFloodElVal_Ext, Dwelling_HOE#BaseFloodElValOverridden_Ext)
  var _baseFloodElevation : TunaValueDTO as BaseFloodElevation

  @JsonProperty
  @TunaValue(HOLocation_HOE#BCEG_Ext, HOLocation_HOE#BCEGMatchLevel_Ext, HOLocation_HOE#OverrideBCEG_Ext, HOLocation_HOE#BCEGOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _bcegGrade : TunaValueDTO as BCEGGrade

  @JsonProperty @Required
  var clueHit_Ext : boolean as ClueHit_Ext

  @JsonProperty @Required
  var creditStatus : CreditStatusExt as CreditStatus

  @JsonProperty
  @TunaValue(HOLocation_HOE#DistToCoast_Ext, HOLocation_HOE#DistToCoastMatchLevel_Ext, HOLocation_HOE#OverrideDistToCoast_Ext, HOLocation_HOE#DistToCoastOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _distanceToCoast : TunaValueDTO as DistanceToCoast

  @JsonProperty
  @TunaValue(HOLocation_HOE#DistBOW_Ext, HOLocation_HOE#DistBOWMatchLevel_Ext, HOLocation_HOE#OverrideDistBOW_Ext, HOLocation_HOE#DistBOWOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _distanceToBOW : TunaValueDTO as DistanceToBodyOfWater

  @JsonProperty
  @TunaValue(HOLocation_HOE#DistBOWNamedValue_Ext, HOLocation_HOE#DistBOWNVMatchLevel_Ext, HOLocation_HOE#OverrideDistBOWNamedValue_Ext, HOLocation_HOE#DistBOWNVOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _distanceToBOWNV : TunaValueDTO as DistanceToBodyOfWaterNamedValue

  @JsonProperty @Required
  var _distToFireHydrant : int as DistanceToFireHydrant

  @JsonProperty @Required
  var _distToFireStation : int as DistanceToFireStation

  @JsonProperty @Required
  var _dwellingLocation : typekey.DwellingLocationType_HOE as DwellingLocation

  @JsonProperty
  @TunaValue(HOLocation_HOE#DwellingProtectionClasscode, HOLocation_HOE#DwellingPCCodeMatchLevel_Ext, HOLocation_HOE#OverrideDwellingPCCode_Ext, HOLocation_HOE#DwellingPCCodeOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _dwellingProtectionClasscode : TunaValueDTO as DwellingProtectionClasscode

  @JsonProperty @Required
  var _dwellingUseage :  typekey.DwellingUsage_HOE as DwellingUsage

  @JsonProperty
  @TunaValue(Dwelling_HOE#EarthQuakeTer_Ext, Dwelling_HOE#EarthquakeTerMatchLevel_Ext, Dwelling_HOE#OverrideEarthquakeTer_Ext, Dwelling_HOE#EarthquakeTerOverridden_Ext)
  var _earthQuakeTerritory : TunaValueDTO as EarthQuakeTerritory

  @JsonProperty
  @TunaValue(HOLocation_HOE#Fireaccess_Ext, HOLocation_HOE#FireaccessMatchLevel_Ext, HOLocation_HOE#OverrideFireaccess_Ext, HOLocation_HOE#FireaccessOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireAccess : TunaValueDTO as FireAccess

  @JsonProperty
  @TunaValue(HOLocation_HOE#FirelineAdjHaz_Ext, HOLocation_HOE#FirelineAdjHazMatchLevel_Ext, HOLocation_HOE#OverrideFirelineAdjHaz_Ext, HOLocation_HOE#FirelineAdjHazOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireLineAdjHazardScore : TunaValueDTO as FireLineAdjHazardScore

  @JsonProperty
  @TunaValue(HOLocation_HOE#FirelineFuel_Ext, HOLocation_HOE#FirelineFuelMatchLevel_Ext, HOLocation_HOE#OverrideFirelineFuel_Ext, HOLocation_HOE#FirelineFuelOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireLineFuel : TunaValueDTO as FireLineFuel

  @JsonProperty
  @TunaValue(HOLocation_HOE#Firelinemthlvl_Ext, HOLocation_HOE#FirelinemthlvlMatchLevel_Ext, HOLocation_HOE#OverrideFirelnmthlevelval_Ext, HOLocation_HOE#FirelinemhlvlOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireLineMatch : TunaValueDTO as FireLineMatch

  @JsonProperty
  @TunaValue(HOLocation_HOE#FirelineSHIA_Ext, HOLocation_HOE#FirelineSHIAMatchLevel_Ext, HOLocation_HOE#OverrideFirelineSHIA_Ext, HOLocation_HOE#FirelineSHIAOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireLineSHIA : TunaValueDTO as FireLineSHIA

  @JsonProperty
  @TunaValue(HOLocation_HOE#FirelinePrHaz_Ext, HOLocation_HOE#FirelinePropHazMatchLevel_Ext, HOLocation_HOE#OverrideFirelinePropHaz_Ext, HOLocation_HOE#FirelinePropHazOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireLinePropHaz : TunaValueDTO as FireLinePropHaz

  @JsonProperty
  @TunaValue(HOLocation_HOE#Fireslope_Ext, HOLocation_HOE#FireslopeMatchLevel_Ext, HOLocation_HOE#OverrideFireslope_Ext, HOLocation_HOE#FireslopeOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _fireSlope : TunaValueDTO as FireSlope

  @JsonProperty @Required
  var firstTimeDeededHome_Ext : boolean as FirstTimeDeededHome_Ext

  @JsonProperty @Required
  var _floodingOrFireHazard : boolean as FloodingOrFireHazard

  @JsonProperty
  @TunaValue(Dwelling_HOE#PropFloodVal_Ext, Dwelling_HOE#PropFloodValMatchLevel_Ext, Dwelling_HOE#OverridePropFloodVal_Ext, Dwelling_HOE#PropFloodValOverridden_Ext)
  var _floodZone : TunaValueDTO as FloodZone

  @JsonProperty
  @TunaValue(PolicyLocation#Latitude_Ext, PolicyLocation#LatitudeMatchLevel_Ext, PolicyLocation#OverrideLatitude_Ext, PolicyLocation#LatitudeOverridden_Ext, {Dwelling_HOE#HOLocation, HOLocation_HOE#PolicyLocation})
  var _locationLatitude : TunaValueDTO as LocationLatitude

  @JsonProperty
  @TunaValue(PolicyLocation#Longitude_Ext, PolicyLocation#LongitudeMatchLevel_Ext, PolicyLocation#OverrideLongitude_Ext, PolicyLocation#LongitudeOverridden_Ext, {Dwelling_HOE#HOLocation, HOLocation_HOE#PolicyLocation})
  var _locationLongitude: TunaValueDTO as LocationLongitude

  @JsonProperty @Required
  var _nearCommercial : boolean as NearCommercial

  @JsonProperty @Required
  var _occupancy : typekey.DwellingOccupancyType_HOE  as Occupancy

  @JsonProperty @Required
  @TypeKeyNotIn({
      typekey.ResidenceType_HOE.TC_CONDO,  //fam1
      typekey.ResidenceType_HOE.TC_DIYCONSTRUCTION_EXT,  //fam2
      typekey.ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT, //townrow
      typekey.ResidenceType_HOE.TC_MOBILEHOME_EXT  //mobile
  })
  var _residenceType : typekey.ResidenceType_HOE as ResidenceType

  @JsonProperty @Required
  @TunaValue(HOLocation_HOE#ResFireDept_Ext, HOLocation_HOE#ResFireDeptMatchLevel_Ext, HOLocation_HOE#OverrideResFireDept_Ext, HOLocation_HOE#ResFireDeptOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _respondingFireDept : TunaValueDTO as RespondingFireDept

  @JsonProperty
  @TunaValue(Dwelling_HOE#SquareFootage_Ext, Dwelling_HOE#TotalSqFtValMatchLevel_Ext, Dwelling_HOE#OverrideTotalSqFtVal_Ext, Dwelling_HOE#TotalSqFtValOverridden_Ext)
  var _squareFootage : TunaValueDTO as SquareFootage

  @JsonProperty @Required
  @TunaValue(HOLocation_HOE#TerritoryCodeTunaReturned_Ext, HOLocation_HOE#TerritoryCodeMatchLevel_Ext, HOLocation_HOE#OverrideTerritoryCode_Ext, HOLocation_HOE#TerritoryCodeOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _territoryCodeTunaReturned_Ext: TunaValueDTO as TerritoryCodeTunaReturned_Ext


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
  @TunaValue(HOLocation_HOE#ISO360ValueID_Ext, HOLocation_HOE#ISO360MatchLevel_Ext, HOLocation_HOE#OverrideISO360_Ext, HOLocation_HOE#ISO360Overridden_Ext, {Dwelling_HOE#HOLocation})
  private var _iso360ValueID : Boolean as ISO360ValueID

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

  @JsonProperty
  var _hasAffinityDiscount : boolean as HasAffinityDiscount

  @JsonProperty
  var _affinityGroupName : String as AffinityGroupName

  @JsonProperty
  var _preferredBuilderName : String as PreferredBuilderName

  @JsonProperty
  private var _doesStoveSitOnNonCombustibleBase : Boolean as DoesStoveSitOnNonCombustibleBase

  @JsonProperty
  private var _doesStoveMeetOrdinanceAndCodes : Boolean as  DoesStoveMeetOrdinancesAndCodes

  @JsonProperty
  private var _isStoveULListed : Boolean as IsStoveULListed

  @JsonProperty
  private var _floodRiskType : FloodRiskType_Ext as FloodRiskType
  @JsonProperty
  var _coastLocation : CoastLocation_Ext as CoastLocation

  @JsonProperty
  var _onBarrierIsland : Boolean as OnBarrierIsland

  @JsonProperty
  var _electricalType : BreakerType_HOE as ElectricalType

}
