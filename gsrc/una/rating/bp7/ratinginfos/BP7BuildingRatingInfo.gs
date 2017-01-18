package una.rating.bp7.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/7/17
 */
class BP7BuildingRatingInfo {

  var _moneyAndSecuritiesLimit : String as MoneyAndSecuritiesLimit
  var _buildingPropertyType : BP7PropertyType as BuildingPropertyType
  var _attachedLimit : BigDecimal as AttachedLimit
  var _detachedLimit : BigDecimal as DetachedLimit
  var _sinkholeCovLimit : BigDecimal as SinkholeCovLimit
  var _sinkholeDeductible : String as SinkholeDeductible
  var _territoryCode : String as TerritoryCode
  var _damageToPremisesRentedLimit : BigDecimal as DamageToPremisesRentedLimit

  construct(building : BP7Building) {
    _buildingPropertyType = building?.PropertyType
    if(building.BP7BuildingMoneySecurities_EXTExists)
      _moneyAndSecuritiesLimit = building.BP7BuildingMoneySecurities_EXT?.BP7InsideOutsideLimit_EXTTerm.DisplayValue
    if(building.BP7LocationOutdoorSigns_EXTExists){
      _attachedLimit = building?.BP7LocationOutdoorSigns_EXT?.AttachedLimit_EXTTerm?.Value
      _detachedLimit = building?.BP7LocationOutdoorSigns_EXT?.DetachedLimit_EXTTerm?.Value
    }
    if(building.BP7SinkholeLossCoverage_EXTExists){
      _sinkholeCovLimit = building?.BP7SinkholeLossCoverage_EXT?.SinkholeLossCovLimit_EXTTerm?.Value
      _sinkholeDeductible = building?.BP7SinkholeLossCoverage_EXT?.SinkholeLossCovDeduc_EXTTerm?.DisplayValue
      _territoryCode = building?.Location?.OverrideTerritoryCode_Ext? building?.Location?.TerritoryCodeOverridden_Ext : building?.Location?.TerritoryCodeTunaReturned_Ext
    }
    if(building.BP7DamagePremisisRentedToYou_EXTExists){
      _damageToPremisesRentedLimit = building?.BP7DamagePremisisRentedToYou_EXT?.BP7DamagetoPremLimit_EXTTerm?.Value
    }
  }
}