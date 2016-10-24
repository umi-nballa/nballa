package una.rating.ho.common

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 10/12/16
 * Time: 1:20 PM
 * To change this template use File | Settings | File Templates.
 */
class HORatingInfo {
  var _totalBasePremium: BigDecimal as TotalBasePremium = 0.0
  var _adjustedBaseClassPremium: BigDecimal as AdjustedBaseClassPremium = 0.0
  var _superiorConstructionDiscount: BigDecimal as SuperiorConstructionDiscount = 0.0
  var _ageOfHomeDiscount: BigDecimal as AgeOfHomeDiscount = 0.0
  var _seasonalSecondaryResidenceSurcharge: BigDecimal as SeasonalSecondaryResidenceSurcharge = 0.0




}