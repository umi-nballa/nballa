package una.rating.ho.group1.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 8/31/17
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */
class HORenovationCreditRatingInfo {
  var _roofMaterial : typekey.RoofType
  var _furnaceOrHeatingUnitsReplacementYear : int
  var _wiring : typekey.WiringType_HOE
  var _electricalSystem : typekey.BreakerType_HOE
  var _numberOfAmps : typekey.NumberofAmps_Ext
  var _roofReplacementYear : int
  var _dwelling : Dwelling_HOE

  construct(dwelling: Dwelling_HOE){
    _dwelling = dwelling
    _roofMaterial = dwelling.RoofTypeOrOverride
    _roofReplacementYear =  dwelling?.RoofingUpgradeDate
    _furnaceOrHeatingUnitsReplacementYear = dwelling?.HeatingUpgradeDate
    _wiring = dwelling.WiringType
    _electricalSystem = dwelling.ElectricalType
    _numberOfAmps = dwelling.NumberofAmps_Ext

  }


  function renovationCreditApplies() : boolean {
    var creditApplies = false
    var roofReplacementQualifies : boolean
    switch(_roofMaterial){
      case typekey.RoofType.TC_ASPHALTCOMP_EXT:
      case typekey.RoofType.TC_COMPOSITIONTHREETAB_EXT:
      case typekey.RoofType.TC_TARANDGRAVEL_EXT:
        roofReplacementQualifies = (_dwelling.RoofingUpgrade ? ((_dwelling.Branch.EditEffectiveDate.YearOfDate - _roofReplacementYear) < 20) : false)
        break

      case typekey.RoofType.TC_SLATE_EXT:
      case typekey.RoofType.TC_TILECLAY:
      case typekey.RoofType.TC_TILE_CONCRETE_EXT:
      case typekey.RoofType.TC_TILECONCRETE:
        roofReplacementQualifies = (_dwelling.RoofingUpgrade ? ((_dwelling.Branch.EditEffectiveDate.YearOfDate - _roofReplacementYear) < 40) : false)
        break

      case typekey.RoofType.TC_COMPOSITIONARCHITECTURALSHINGLE_EXT:
      case typekey.RoofType.TC_COMPOSITIONIMPACTRESISTSHINGLES_EXT:
      default:
        roofReplacementQualifies = (_dwelling.RoofingUpgrade ? ((_dwelling.Branch.EditEffectiveDate.YearOfDate - _roofReplacementYear) < 30) : false)
        break

    }

    creditApplies = _dwelling.HasCopperPlumbingType and
        (_dwelling.HeatingUpgrade ? ((_dwelling.Branch.EditEffectiveDate.YearOfDate - _furnaceOrHeatingUnitsReplacementYear) < 20) : false) and
        _wiring == typekey.WiringType_HOE.TC_COPPER and
        _electricalSystem == typekey.BreakerType_HOE.TC_CIRCUITBREAKER and
        _numberOfAmps == typekey.NumberofAmps_Ext.TC_HUNDREDFIFTYPLUS and
        roofReplacementQualifies

    return creditApplies
  }


}