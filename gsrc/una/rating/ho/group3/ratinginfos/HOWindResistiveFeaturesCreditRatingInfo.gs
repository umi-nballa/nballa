package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal
uses una.rating.util.HOConstructionTypeMapper

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 */
class HOWindResistiveFeaturesCreditRatingInfo {

  var _yearOfConstruction : int as YearOfConstruction
  var _roofShape : RoofShape_Ext as RoofShape
  var _roofDeck : String as RoofDeck
  var _openingProtection : String as OpeningProtection
  var _fbcWindSpeed : String as FBCWindSpeed
  var _windSpeedOfDesign : String as WindSpeedOfDesign
  var _wdbr : String as WDBR
  var _internalPressureDesign : String as InternalPressureDesign
  var _swr : String as SWR
  var _roofWallConnection : String as RoofWallConnection
  var _roofCover : String as RoofCover
  var _roofDeckAttachment : String as RoofDeckAttachment
  var _doorStrength : String as DoorStrength
  var _terrain : String as Terrain
  var _windPremium : BigDecimal as WindPremium
  private static final var YEAR_2002 : int = 2002
  var _territoryCode : String as TerritoryCode
  var _constructionType: RateTableConstructionType_Ext as ConstructionType





  construct(dwelling : Dwelling_HOE){
    _yearOfConstruction = dwelling.OverrideYearbuilt_Ext? dwelling.YearBuiltOverridden_Ext : dwelling.YearBuilt
    _roofShape = dwelling.OverrideRoofShape_Ext ? dwelling.RoofShapeOverridden_Ext : dwelling.RoofShape_Ext
    _roofDeck = dwelling.RoofDecking_Ext.DisplayName
    _openingProtection = dwelling.OpeningProtection_Ext.DisplayName
    _fbcWindSpeed = dwelling.FBCWindSpeed_Ext.DisplayName
    _windSpeedOfDesign = dwelling.WindSpeedOfDesign_Ext.DisplayName
    _wdbr = dwelling.WindBorneDebrisRegion_Ext.DisplayName
    _internalPressureDesign = dwelling.InternalPressureDsgn_Ext.DisplayName
    _swr = dwelling.SecondaryWaterResis_Ext.DisplayName
    _roofWallConnection = dwelling.RoofWallConnection_Ext.DisplayName
    _roofCover = dwelling.RoofCover_Ext.DisplayName
    _roofDeckAttachment = dwelling.RoofDeckAttachment_Ext.DisplayName
    _doorStrength = dwelling.DoorStrength_Ext.DisplayName
    _terrain = dwelling.Terrain_Ext.DisplayName
    _territoryCode = dwelling?.TerritoryCodeOrOverride
    _constructionType = HOConstructionTypeMapper.setConstructionType(dwelling, dwelling.HOLine.BaseState)

  }

  property get isNewerConstruction() : boolean {
    if(_yearOfConstruction >= 2002)
      return true
    return false
  }

  property get openingProtectionForNewConstruction() : String {
    if(_openingProtection == OpeningProtection_Ext.TC_WINDOWS.DisplayName || _openingProtection == OpeningProtection_Ext.TC_ALL.DisplayName)
      return _openingProtection
    return "None"
  }

  property get roofShapeForAllConstructions() : String {
    if(_roofShape == RoofShape_Ext.TC_HIP)
      return _roofShape.DisplayName
    return "Other"
  }
}