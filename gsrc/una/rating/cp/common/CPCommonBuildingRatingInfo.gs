package una.rating.cp.common

uses java.math.BigDecimal
uses una.rating.cp.util.CPRatingUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 */
class CPCommonBuildingRatingInfo {

  private var _building : CPBuilding
  var _aopDeductible : int as AOPDeductible
  var _riskType : PackageRisk as RiskType
  var _constructionType : String as ConstructionType
  var _protectionClassCode : String as ProtectionClassCode
  var _yearBuilt : int as YearBuilt
  var _buildingLimit : BigDecimal as BuildingLimit
  var _inflationGuard : String as InflationGuard
  var _territoryCode : String as TerritoryCode
  var _ordinanceOrLawCovAAvailable : boolean as OrdinanceOrLawCovAAvailable= false
  var _scheduledRatingModifier : BigDecimal as ScheduledRatingModifier
  var _consentToRateFactor : BigDecimal as ConsentToRateFactor = 1.0
  var _fenceLimit : BigDecimal as FenceLimit
  var _fenceConstructionType : ConstructionType_CP as FenceConstructionType
  var _flagPoleLimit : BigDecimal as FlagPoleLimit
  var _flagPoleConstructionType : ConstructionType_CP as FlagPoleConstructionType
  var _entryGatesLimit : BigDecimal as EntryGatesLimit
  var _entryGatesConstructionType : ConstructionType_CP as EntryGatesConstructionType
  var _carportsLimit : BigDecimal as CarportsLimit
  var _carportsConstructionType : ConstructionType_CP as CarportsConstructionType
  var _mailboxLimit : BigDecimal as MailboxLimit
  var _mailboxConstructionType : ConstructionType_CP as MailboxConstructionType
  var _lightsLimit : BigDecimal as LightsLimit
  var _lightsConstructionType : ConstructionType_CP as LightsConstructionType
  var _playGroundLimit : BigDecimal as PlayGroundLimit
  var _playGroundConstructionType : ConstructionType_CP as PlayGroundConstructionType
  var _poolSpaFountainDeckLimit : BigDecimal as PoolSpaFountainDeckLimit
  var _gazeboLimit : BigDecimal as GazeboLimit
  var _gazeboConstructionType : ConstructionType_CP as GazeboConstructionType
  var _shadeLimit : BigDecimal as ShadeLimit
  var _shadeConstructionType : ConstructionType_CP as ShadeConstructionType
  var _outdoorFurnitureLimit : BigDecimal as OutdoorFurnitureLimit
  var _outdoorFurnitureConstructionType : ConstructionType_CP as OutdoorFurnitureConstructionType
  var _trashLimit : BigDecimal as TrashLimit
  var _trashConstructionType : ConstructionType_CP as TrashConstructionType
  var _otherNOCLimit : BigDecimal as OtherNOCLimit
  var _otherNOCConstructionType : ConstructionType_CP as OtherNOCConstructionType
  var _signsDetachedOutdoorLimit : BigDecimal as SignsDetachedOutdoorLimit
  var _signsDetachedOutdoorConstructionType : ConstructionType_CP as SignsDetachedOutdoorConstructionType
  //TODO : Update the zone number
  var _zoneNumber : int as ZoneNumber = 1

  construct(building : CPBuilding){
    _scheduledRatingModifier = CPRatingUtil.ScheduledRatingModifier
    _riskType = building.CPLocation.CPLine.Branch?.Policy.PackageRisk
    _constructionType = building.Building.ConstructionType.DisplayName
    _aopDeductible = building.CPLocation.CPLine.allotherperilded.Code.toInt()
    _protectionClassCode = building?.OverrideFirePCCode_Ext? building.FirePCCodeOverridden_Ext : building.FireProtectionClassCode
    _yearBuilt = building?.Building.YearBuilt
    _territoryCode = building?.CPLocation?.TerritoryCode?.Code//TerritoryCodes.where( \ elt -> elt.PolicyLinePatternCode=="GLLine").first().Code
    if(building.CPBldgCovExists){
      _buildingLimit = building?.CPBldgCov?.CPBldgCovLimitTerm?.Value
      _inflationGuard = building?.CPBldgCov?.CPBldgCovAutoIncreaseTerm?.DisplayValue
    }
    if(building.CPOrdinanceorLaw_EXTExists){
      if(building.CPOrdinanceorLaw_EXT?.CPOrdinanceorLawCoverage_EXTTerm?.Value != CPOutdoorPropCovType_EXT.TC_COVCONLY_EXT)
        _ordinanceOrLawCovAAvailable = true
    }
    if(building.CPFence_ExtExists){
      _fenceLimit = building.CPFence_Ext?.CPFenceLimit_ExtTerm?.Value
      _fenceConstructionType = building.CPFence_Ext?.CPFenceConst_ExtTerm?.Value
    }
    if(building.CPFlagPole_ExtExists){
      _flagPoleLimit = building.CPFlagPole_Ext?.CPFlagPoleLimit_ExtTerm?.Value
      _flagPoleConstructionType = building.CPFlagPole_Ext?.CPFlagPoleConst_ExtTerm?.Value
    }
    if(building.CPEntryGates_EXTExists){
      _entryGatesLimit = building.CPEntryGates_EXT?.CPEntryGatesLimit_ExtTerm?.Value
      _entryGatesConstructionType = building.CPEntryGates_EXT?.CPEntryGatesConst_ExtTerm?.Value
    }
    if(building.CPCarport_EXTExists){
      _carportsLimit = building.CPCarport_EXT?.CPCarportLimit_EXTTerm?.Value
      _carportsConstructionType = building.CPCarport_EXT?.CPCarportConsType_EXTTerm?.Value
    }
    if(building.CPMailbox_ExtExists){
      _mailboxConstructionType = building.CPMailbox_Ext?.CPMailboxConst_ExtTerm?.Value
      _mailboxLimit = building.CPMailbox_Ext?.CPMailboxLimit_ExtTerm?.Value
    }
    if(building.CPLights_ExtExists){
      _lightsLimit = building.CPLights_Ext?.CPLightsLimit_ExtTerm?.Value
      _lightsConstructionType = building.CPLights_Ext?.CPLightsConst_ExtTerm?.Value
    }
    if(building.CPPlayGround_ExtExists){
      _playGroundLimit = building.CPPlayGround_Ext?.CPPlaygroundLimit_ExtTerm?.Value
      _playGroundConstructionType = building.CPPlayGround_Ext?.CPPlaygroundConst_ExtTerm?.Value
    }
    if(building.CPPoolSpaFountainDeck_EXTExists){
      _poolSpaFountainDeckLimit = building.CPPoolSpaFountainDeck_EXT?.CPPoolSpaFountainDeckLimit_EXTTerm?.Value
    }
    if(building.CPGazebo_ExtExists){
      _gazeboLimit = building.CPGazebo_Ext?.CPGazeboLimit_ExtTerm?.Value
      _gazeboConstructionType = building.CPGazebo_Ext?.CPGazeboConst_ExtTerm?.Value
    }
    if(building.CPShade_ExtExists){
      _shadeLimit = building.CPShade_Ext?.CPShadeLimit_ExtTerm?.Value
      _shadeConstructionType = building.CPShade_Ext?.CPShadeConst_ExtTerm?.Value
    }
    if(building.CPFurniture_ExtExists){
      _outdoorFurnitureLimit = building.CPFurniture_Ext?.CPFurnitureLimit_ExtTerm?.Value
      _outdoorFurnitureConstructionType = building.CPFurniture_Ext?.CPFurnitureConst_ExtTerm?.Value
    }
    if(building.CPTrash_ExtExists){
      _trashLimit = building.CPTrash_Ext?.CPTrashLimit_ExtTerm?.Value
      _trashConstructionType = building.CPTrash_Ext?.CPTrashConst_ExtTerm?.Value
    }
    if(building.CPOther_ExtExists){
      _otherNOCLimit = building.CPOther_Ext?.CPOtherLimit_ExtTerm?.Value
      _otherNOCConstructionType = building.CPOther_Ext?.CPOtherConst_ExtTerm?.Value
    }
    if(building.CPSigns_ExtExists){
      _signsDetachedOutdoorLimit = building.CPSigns_Ext?.CPSignsLimit_ExtTerm?.Value
      _signsDetachedOutdoorConstructionType = building.CPSigns_Ext?.CPSignsConst_ExtTerm?.Value
    }
  }

  property get AgeOfHome() : int {
    return  _building.CPLocation.CPLine.Branch?.EditEffectiveDate?.YearOfDate -  YearBuilt
  }
}