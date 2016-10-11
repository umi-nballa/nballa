package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo {

  var _aopBaseClassPremium : BigDecimal as AOPBaseClassPremium = 0.0
  var _windBaseClassPremium : BigDecimal as WindBaseClassPremium = 0.0

  var _windBasePremium : BigDecimal as WindBasePremium = 0.0
  var _adjustedAOPBasePremium : BigDecimal as AdjustedAOPBasePremium = 0.0
  var _keyFactor : BigDecimal as KeyFactor = 0.0
  var _protectionConstructionFactor : BigDecimal as ProtectionConstructionFactor = 0.0
}