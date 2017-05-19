package una.rating.ho.common

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 10/12/16
 * Time: 1:20 PM
 */
class HORatingInfo {
  var _totalBasePremium: BigDecimal as TotalBasePremium = 0.0
  var _adjustedBaseClassPremium: BigDecimal as AdjustedBaseClassPremium = 0.0
  var _superiorConstructionDiscount: BigDecimal as SuperiorConstructionDiscount = 0.0
  var _ageOfHomeDiscount: BigDecimal as AgeOfHomeDiscount = 0.0
  var _seasonalSecondaryResidenceSurcharge: BigDecimal as SeasonalSecondaryResidenceSurcharge = 0.0
  var _keyPremium : BigDecimal as KeyPremium = 0.0
  var _multiLineDiscount : BigDecimal as MultiLineDiscount = 0.0
  var _protectiveDevicesDiscount : BigDecimal as ProtectiveDevicesDiscount = 0.0
  var _discountAdjustment : BigDecimal as DiscountAdjustment = 0.0
  var _affinityDiscount : BigDecimal as AffinityDiscount = 0.0
}