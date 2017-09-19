package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.Year
uses edge.capabilities.quote.draft.annotation.TunaValue
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses edge.capabilities.quote.lob.homeowners.draft.metadata.DetailOf
uses edge.capabilities.quote.lob.homeowners.draft.metadata.NotAFutureYear
uses edge.jsonmapper.JsonProperty

uses java.lang.Integer
uses edge.aspects.validation.annotations.Augment

/**
 * Additional building details for the Construction page.
 */
class ConstructionDTO {

  /** Type of the construction of this structure. */
  @JsonProperty
  @Required
  @TunaValue(Dwelling_HOE#ConstructionType, Dwelling_HOE#ConstructionTypeMatchLevel_Ext, Dwelling_HOE#OverrideConstructionType_Ext, Dwelling_HOE#ConstTypeOverridden_Ext)
  var _constructionType: TunaValueDTO as ConstructionType

  @JsonProperty
  @DetailOf("ConstructionType.Value", ConstructionType_HOE.TC_OTHER)
  var _constructionTypeDescription: String as ConstructionTypeDescription

  /** Type of the construction of the second floor of this structure. */
  @JsonProperty
  @TunaValue(Dwelling_HOE#ConstructionTypeL2_Ext, Dwelling_HOE#ConstructionTypeMatchLvlL2_Ext, Dwelling_HOE#OverrideConstructionTypeL2_Ext, Dwelling_HOE#ConstTypeOverriddenL2_Ext)
  var _constructionTypeFloor2: TunaValueDTO as ConstructionTypeFloor2

  @JsonProperty
  @DetailOf("ConstructionTypeFloor2.Value", ConstructionType_HOE.TC_OTHER)
  var _constructionTypeLevel2Description: String as ConstructionTypeLevel2Description

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _doorStrength: DoorStrength_Ext as DoorStrength

  /** Electrical type of the building. */
  @JsonProperty
  var _electricalType: BreakerType_HOE as ElectricalType

  @JsonProperty
  //@Required
  var _isEligbleForWindStormCov: Boolean as EligibleForWindStormCov

  /*@JsonProperty
  @DetailOf("ElectricalType", BreakerType_HOE.TC_FUSE_EXT)  //TC_OTHER   --Portal
  var _electricalTypeDescription : String as ElectricalTypeDescription*/

  @JsonProperty
  @Required
  @TunaValue(Dwelling_HOE#ExteriorWallFinish_Ext, Dwelling_HOE#ExteriorWFvalMatchLevel_Ext, Dwelling_HOE#OverrideExteriorWFval_Ext, Dwelling_HOE#ExteriorWFvalueOverridden_Ext)
  var _exteriorWallFinish: TunaValueDTO as ExteriorWallFinish

  @JsonProperty
  @DetailOf("ExteriorWallFinish.Value", ExteriorWallFinish_Ext.TC_OTHER)
  var _exteriorWallFinishDescription: String as ExteriorWallFinishDescription

  @JsonProperty
  @TunaValue(Dwelling_HOE#ExteriorWallFinishL1_Ext, Dwelling_HOE#ExteriorWFvalMatchLevelL1_Ext, Dwelling_HOE#OverrideExteriorWFvalL1_Ext, Dwelling_HOE#ExteriorWFvalueOverridL1_Ext)
  var _exteriorWallFinishLevel1: TunaValueDTO as ExteriorWallFinishLevel1

  @JsonProperty
  @DetailOf("ExteriorWallFinishLevel1.Value", ExteriorWallFinish_Ext.TC_OTHER)
  var _exteriorWallFinishLevel1Description: String as ExteriorWallFinishLevel1Description

  @JsonProperty
  @TunaValue(Dwelling_HOE#ExteriorWallFinishL2_Ext, Dwelling_HOE#ExteriorWFvalMatchLevelL2_Ext, Dwelling_HOE#OverrideExteriorWFvalL2_Ext, Dwelling_HOE#ExteriorWFvalueOverridL2_Ext)
  var _exteriorWallFinishFloor2: TunaValueDTO as ExteriorWallFinishLevel2

  @JsonProperty
  @DetailOf("ExteriorWallFinishLevel2.Value", ExteriorWallFinish_Ext.TC_OTHER)
  var _exteriorWallFinishLevel2Description: String as ExteriorWallFinishLevel2Description

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _fbcWindSpeed: FBCWindSpeed_Ext as FBCWindSpeed

  @JsonProperty
  var _floorLocation: String as FloorLocation

  @JsonProperty
  var _foundationHeight: FoundationHeight_Ext as FoundationHeight

  @JsonProperty
  var _foundationProtected: Boolean as FoundationProtected

  @JsonProperty
  var _foundationMaterial: FoundationMaterial_Ext as FoundationMaterial

  @JsonProperty
  var _foundationType: FoundationType_HOE as FoundationType

  @JsonProperty
  @DetailOf("FoundationType", FoundationType_HOE.TC_OTHER)
  var _foundationTypeDescription: String as FoundationTypeDescription

  @JsonProperty
  var _hailResistantRoofCredit: Boolean as HailResistantRoofCredit

  /** Type of garage on this building. */
  @JsonProperty
  @Required
  var _hasGarage: boolean as HasGarage

  @JsonProperty
  var _hasHeatSrcCentralElectric: Boolean as HasHeatSrcCentralElectric

  @JsonProperty
  var _hasHeatSrcCentralNaturalGas: Boolean as HasHeatSrcCentralNaturalGas

  @JsonProperty
  var _hasHeatSrcCentralPropane: Boolean as HasHeatSrcCentralPropane

  @JsonProperty
  var _hasHeatSrcCentralOther: Boolean as HasHeatSrcCentralOther

  @JsonProperty
  var _hasHeatSrcFireplace: Boolean as HasHeatSrcFireplace

  @JsonProperty
  var _hasHeatSrcPortableAllFuelTypes: Boolean as HasHeatSrcPortableAllFuelTypes

  @JsonProperty
  var _hasHeatSrcWoodBurningStove: Boolean as HasHeatSrcWoodBurningStove

  @JsonProperty
  var _hasWindMitForm: Boolean as HasWindMitForm

  @JsonProperty
  var _heatingUpgradeExists: Boolean as HeatingUpgradeExists

  @JsonProperty
  //@UpgradeYear("HeatingUpgradeExists")
  var _heatingUpgradeYear: Integer as HeatingUpgradeYear

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _internalPressureDesign: InternalPressureDsgn_Ext as InternalPressureDesign

  @JsonProperty
  var _numberOfAmps: NumberofAmps_Ext as NumberOfAmps

  @JsonProperty
  var _numberOfRoofLayers: Integer as NumberOfRoofLayers

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _openingProtection : OpeningProtection_Ext as OpeningProtection

  @JsonProperty
  var _panelManufacturer: PanelManufacturer_Ext as PanelManufacturer

  @JsonProperty
  private var _hasSteelPlumbingType : Boolean as HasSteelPlumbingType

  @JsonProperty
  private var _hasCopperPlumbingType : Boolean as HasCopperPlumbingType

  @JsonProperty
  private var _hasCastIronPlumbingType : Boolean as HasCastIronPlumbingType

  @JsonProperty
  private var _hasPolybutylenePlumbingType : Boolean as HasPolybutylenePlumbingType

  @JsonProperty
  private var _hasPEXPlumbingType : Boolean as HasPEXPlumbingType

  @JsonProperty
  private var _hasGalvanizedPlumbingType : Boolean as HasGalvanizedPlumbingType

  @JsonProperty
  private var _hasPVCPlumbingType : Boolean as HasPVCPlumbingType

  @JsonProperty
  private var _hasOtherPlumbingType : Boolean as HasOtherPlumbingType

  @JsonProperty
  var _plumbingTypeDescription: String as PlumbingTypeDescription

  @JsonProperty
  var _plumbingUpgradeExists: Boolean as PlumbingUpgradeExists

  @JsonProperty
  //@UpgradeYear("PlumbingUpgradeExists")
  var _plumbingUpgradeYear: Integer as PlumbingUpgradeYear

  /** Type of primary heating. */
  @JsonProperty
  var _primaryHeatingType: HeatingType_HOE as PrimaryHeatingType

  @JsonProperty
  var _propertyContainsAsbestos: Boolean as PropertyContainsAsbestos

  /** Type of primary heating. */
  /* @JsonProperty
   @DetailOf("PrimaryHeatingType", HeatingType_HOE.TC_NONE_EXT)//TC_OTHER  --Portal
   var _primaryHeatingTypeDescription : String as PrimaryHeatingTypeDescription
 */

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _roofCover: RoofCover_Ext as RoofCover

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _roofDeckAttachment: RoofDeckAttachment_Ext as RoofDeckAttachment

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _roofDecking: RoofDecking_Ext as RoofDecking

  @JsonProperty
  @Required
  @TunaValue(Dwelling_HOE#RoofShape_Ext, Dwelling_HOE#RoofShapeMatchLevel_Ext, Dwelling_HOE#OverrideRoofShape_Ext, Dwelling_HOE#RoofShapeOverridden_Ext)
  var _roofShape: TunaValueDTO as RoofShape

  @JsonProperty
  var _roofSlope: Boolean as RoofSlope

  /** Type of the roof. */
  @JsonProperty
  @Required
  //@FilterBy("HOSpecific")
  @TunaValue(Dwelling_HOE#RoofType, Dwelling_HOE#RoofTypeMatchLevel_Ext, Dwelling_HOE#OverrideRoofType_Ext, Dwelling_HOE#RoofingMaterialOverridden_Ext)
  var _roofType: TunaValueDTO as RoofType

  @JsonProperty
  @DetailOf("RoofType", RoofType.TC_OTHER)
  var _roofTypeDescription: String as RoofTypeDescription

  @JsonProperty
  var _roofUpgradeExists: Boolean as RoofUpgradeExists

  @JsonProperty
  //@UpgradeYear("RoofUpgradeExists")
  var _roofUpgradeYear: Integer as RoofUpgradeYear

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _roofWallConnection: RoofWallConnection_Ext as RoofWallConnection

  @JsonProperty
  @Required
  var _secondaryHeatingExists: boolean as SecondaryHeatingExists

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _secondaryWaterResistance: SecondaryWaterResis_Ext as SecondaryWaterResistance

  /** Reference to number of stories in this building. */
  @JsonProperty
  @Required
  @TunaValue(Dwelling_HOE#StoriesNumber, Dwelling_HOE#StoriesNumberMatchLevel_Ext, Dwelling_HOE#OverrideStoriesNumber_Ext, Dwelling_HOE#NoofStoriesOverridden_Ext)
  var _storiesNumber: TunaValueDTO as StoriesNumber

  @JsonProperty
  var _supplementalHeatingSurcharge: Boolean as SupplementalHeatingSurcharge

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _terrain : Terrain_Ext as Terrain

  @JsonProperty
  var _upstairsLaundrySurcharge: Boolean as UpstairsLaundrySurcharge

  @JsonProperty
  @Required
  @TunaValue(HOLocation_HOE#WindPool_Ext, HOLocation_HOE#WindPoolMatchLevel_Ext, HOLocation_HOE#OverrideWindPool_Ext, HOLocation_HOE#WindPoolOverridden_Ext, {Dwelling_HOE#HOLocation})
  var _windPool: TunaValueDTO as WindPool

  @JsonProperty
  var _windHurrHailExcl: Boolean as WindStormHurricaneHailExclusion

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _windBorneDebrisRegion: WindBorneDebrisRegion_Ext as WindBorneDebrisRegion

  @JsonProperty
  @DetailOf("HasWindMitForm", true)
  var _WindSpeedOfDesign: WindSpeedOfDesign_Ext as WindSpeedOfDesign

  /** Type of wiring in the building. */
  @JsonProperty
  var _wiringType: WiringType_HOE as WiringType

  @JsonProperty
  @DetailOf("WiringType", WiringType_HOE.TC_OTHER)
  var _wiringTypeDescription: String as WiringTypeDescription

  @JsonProperty
  var _wiringUpgradeExists: Boolean as WiringUpgradeExists

  @JsonProperty
  //@UpgradeYear("WiringUpgradeExists")
  var _wiringUpgradeYear: Integer as WiringUpgradeYear

  @JsonProperty
  @Required
  //@Year
  //@NotAFutureYear
  //var _yearBuilt: int as YearBuilt
//  @JsonProperty @Required
//  @Augment({"Value","OverrideValue"}, {new Year(), new NotAFutureYear()})
  @TunaValue(Dwelling_HOE#YearBuilt, Dwelling_HOE#YearbuiltMatchLevel_Ext, Dwelling_HOE#OverrideYearbuilt_Ext, Dwelling_HOE#YearBuiltOverridden_Ext)
  var _yearBuilt : TunaValueDTO as YearBuilt
}
