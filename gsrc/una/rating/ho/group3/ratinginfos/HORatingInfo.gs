package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {
  var _aopBaseClassPremium: BigDecimal as AOPBaseClassPremium = 0.0
  var _windBaseClassPremium: BigDecimal as WindBaseClassPremium = 0.0
  var _windBasePremium: BigDecimal as WindBasePremium = 0.0
  var _adjustedAOPBasePremium: BigDecimal as AdjustedAOPBasePremium = 0.0
  var _aopKeyFactor: BigDecimal as AOPKeyFactor = 0.0
  var _windKeyFactor: BigDecimal as WindKeyFactor = 0.0
  var _protectionConstructionFactor: BigDecimal as ProtectionConstructionFactor = 0.0

  //discounts and surcharges
  var _superiorConstructionDiscountForAOP: BigDecimal as SuperiorConstructionDiscountForAOP = 0.0
  var _seasonalSecondaryResidenceSurchargeForAOP: BigDecimal as SeasonalSecondaryResidenceSurchargeForAOP = 0.0
  var _matureHomeOwnerDiscount : BigDecimal as MatureHomeOwnerDiscount = 0.0
  var _higherAllPerilDeductible : BigDecimal as HigherAllPerilDeductible = 0.0
}