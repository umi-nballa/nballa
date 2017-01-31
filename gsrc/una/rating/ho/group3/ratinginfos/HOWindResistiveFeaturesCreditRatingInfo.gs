package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 */
class HOWindResistiveFeaturesCreditRatingInfo {

  var _yearOfConstruction : int as YearOfConstruction
  var _roofDeck : RoofDecking_Ext as RoofDeck
  var _openingProtection : OpeningProtection_Ext as OpeningProtection
  var _fbcWindSpeed : FBCWindSpeed_Ext as FBCWindSpeed
  var _windSpeedOfDesign : WindSpeedOfDesign_Ext as WindSpeedOfDesign
  var _wdbr : WindBorneDebrisRegion_Ext as WDBR
  var _internalPressureDesign : InternalPressureDsgn_Ext as InternalPressureDesign
  var _swr : SecondaryWaterResis_Ext as SWR
  var _roofWallConnection : RoofWallConnection_Ext as RoofWallConnection
  var _roofCover : RoofCover_Ext as RoofCover
  var _roofDeckAttachment : RoofDeckAttachment_Ext as RoofDeckAttachment
  var _doorStrength : DoorStrength_Ext as DoorStrength
  var _terrain : Terrain_Ext as Terrain
  var _roofShape : RoofShape_Ext as RoofShape
  var _windPremium : BigDecimal as WindPremium

  construct(dwelling : Dwelling_HOE){
    _yearOfConstruction = dwelling.OverrideYearbuilt_Ext? dwelling.YearBuiltOverridden_Ext : dwelling.YearBuilt
    _roofShape = dwelling.OverrideRoofShape_Ext ? dwelling.RoofShapeOverridden_Ext : dwelling.RoofShape_Ext
    _roofDeck = dwelling.RoofDecking_Ext
    _openingProtection = dwelling.OpeningProtection_Ext
    _fbcWindSpeed = dwelling.FBCWindSpeed_Ext
    _windSpeedOfDesign = dwelling.WindSpeedOfDesign_Ext
    _wdbr = dwelling.WindBorneDebrisRegion_Ext
    _internalPressureDesign = dwelling.InternalPressureDsgn_Ext
    _swr = dwelling.SecondaryWaterResis_Ext
    _roofWallConnection = dwelling.RoofWallConnection_Ext
    _roofCover = dwelling.RoofCover_Ext
    _roofDeckAttachment = dwelling.RoofDeckAttachment_Ext
    _doorStrength = dwelling.DoorStrength_Ext
    _terrain = dwelling.Terrain_Ext
  }

  property get isNewerConstruction() : boolean {
    if(_yearOfConstruction >= 2001)
      return true
    return false
  }

  property get openingProtectionForNewConstruction() : String {
    if(_openingProtection == OpeningProtection_Ext.TC_WINDOWS || _openingProtection == OpeningProtection_Ext.TC_ALL)
      return _openingProtection.DisplayName
    return "None"
  }

  property get roofShapeForAllConstructions() : String {
    if(_roofShape == RoofShape_Ext.TC_HIP)
      return _roofShape.DisplayName
    return "Other"
  }
}