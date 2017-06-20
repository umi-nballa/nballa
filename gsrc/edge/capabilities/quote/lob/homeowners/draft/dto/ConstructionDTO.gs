package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.aspects.validation.annotations.Required
uses edge.aspects.validation.annotations.Year
uses edge.capabilities.quote.draft.annotation.TunaValue
uses edge.capabilities.quote.draft.dto.TunaValueDTO
uses edge.capabilities.quote.lob.homeowners.draft.metadata.DetailOf
uses edge.capabilities.quote.lob.homeowners.draft.metadata.NotAFutureYear
uses edge.capabilities.quote.lob.homeowners.draft.metadata.UpgradeYear
uses edge.jsonmapper.JsonProperty

uses java.lang.Integer

/**
 * Additional building details for the Construction page.
 */
class ConstructionDTO {

  /** Type of the construction of this structure. */
  @JsonProperty
  @Required
  //@TunaValue(Dwelling_HOE#ConstructionType, Dwelling_HOE#ConstructionTypeMatchLevel_Ext, Dwelling_HOE#OverrideConstructionType_Ext, Dwelling_HOE#ConstTypeOverridden_Ext)
  var _constructionType: ConstructionType_HOE as ConstructionType

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

  /** Electrical type of the building. */
  @JsonProperty
  @Required
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
  var _floorLocation: String as FloorLocation

  @JsonProperty
  @Required
  var _foundationHeight: FoundationHeight_Ext as FoundationHeight

  @JsonProperty
  @Required
  var _foundationMaterial: FoundationMaterial_Ext as FoundationMaterial

  @JsonProperty
  @Required
  var _foundationType: FoundationType_HOE as FoundationType

  @JsonProperty
  @DetailOf("FoundationType", FoundationType_HOE.TC_OTHER)
  var _foundationTypeDescription: String as FoundationTypeDescription

  /** Type of garage on this building. */
  @JsonProperty
  @Required
  var _hasGarage: boolean as HasGarage

  @JsonProperty
  var _hasHeatSrcCentralElectric: boolean as HasHeatSrcCentralElectric

  @JsonProperty
  var _hasHeatSrcCentralNaturalGas: boolean as HasHeatSrcCentralNaturalGas

  @JsonProperty
  var _hasHeatSrcCentralPropane: boolean as HasHeatSrcCentralPropane

  @JsonProperty
  var _hasHeatSrcCentralOther: boolean as HasHeatSrcCentralOther

  @JsonProperty
  var _hasHeatSrcFireplace: boolean as HasHeatSrcFireplace

  @JsonProperty
  var _hasHeatSrcPortableAllFuelTypes: boolean as HasHeatSrcPortableAllFuelTypes

  @JsonProperty
  var _hasHeatSrcWoodBurningStove: boolean as HasHeatSrcWoodBurningStove

  @JsonProperty
  var _heatingUpgradeExists: Boolean as HeatingUpgradeExists

  @JsonProperty
  @UpgradeYear("HeatingUpgradeExists")
  var _heatingUpgradeYear: Integer as HeatingUpgradeYear

  @JsonProperty
  var _numberOfAmps: NumberofAmps_Ext as NumberOfAmps

  @JsonProperty
  var _numberOfRoofLayers: Integer as NumberOfRoofLayers

  @JsonProperty
  var _panelManufacturer: PanelManufacturer_Ext as PanelManufacturer

  /** Type of plumbing in the building. */
  @JsonProperty
  @Required
  var _plumbingType: PlumbingType_HOE as PlumbingType

  @JsonProperty
  @DetailOf("PlumbingType", PlumbingType_HOE.TC_OTHER)
  var _plumbingTypeDescription: String as PlumbingTypeDescription

  @JsonProperty
  var _plumbingUpgradeExists: Boolean as PlumbingUpgradeExists

  @JsonProperty
  @UpgradeYear("PlumbingUpgradeExists")
  var _plumbingUpgradeYear: Integer as PlumbingUpgradeYear

  /** Type of primary heating. */
  @JsonProperty
  @Required
  var _primaryHeatingType: HeatingType_HOE as PrimaryHeatingType

  /** Type of primary heating. */
  /* @JsonProperty
   @DetailOf("PrimaryHeatingType", HeatingType_HOE.TC_NONE_EXT)//TC_OTHER  --Portal
   var _primaryHeatingTypeDescription : String as PrimaryHeatingTypeDescription
 */

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
  @UpgradeYear("RoofUpgradeExists")
  var _roofUpgradeYear: Integer as RoofUpgradeYear

  @JsonProperty
  @Required
  var _secondaryHeatingExists: boolean as SecondaryHeatingExists

  /** Reference to number of stories in this building. */
  @JsonProperty
  @Required
  @TunaValue(Dwelling_HOE#StoriesNumber, Dwelling_HOE#StoriesNumberMatchLevel_Ext, Dwelling_HOE#OverrideStoriesNumber_Ext, Dwelling_HOE#NoofStoriesOverridden_Ext)
  var _storiesNumber: TunaValueDTO as StoriesNumber

  @JsonProperty
  var _upstairsLaundrySurcharge: Boolean as UpstairsLaundrySurcharge

  @JsonProperty
  @Required
  //@TunaValue(HOLocation_HOE#WindPool_Ext, HOLocation_HOE#WindPoolMatchLevel_Ext, HOLocation_HOE#OverrideWindPool_Ext, HOLocation_HOE#WindPoolOverridden_Ext)
  var _windPool: Boolean as WindPool

  /** Type of wiring in the building. */
  @JsonProperty
  @Required
  var _wiringType: WiringType_HOE as WiringType

  @JsonProperty
  @DetailOf("WiringType", WiringType_HOE.TC_OTHER)
  var _wiringTypeDescription: String as WiringTypeDescription

  @JsonProperty
  var _wiringUpgradeExists: Boolean as WiringUpgradeExists

  @JsonProperty
  @UpgradeYear("WiringUpgradeExists")
  var _wiringUpgradeYear: Integer as WiringUpgradeYear

  @JsonProperty
  @Required
  @Year
  @NotAFutureYear
  var _yearBuilt: int as YearBuilt
}
