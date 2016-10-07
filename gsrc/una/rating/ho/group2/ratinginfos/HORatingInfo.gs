package una.rating.ho.group2.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo {
  var _adjustedBasePremium : BigDecimal as AdjustedBasePremium = 0.0
  var _windHailCredit : BigDecimal as WindHailExclusionCredit = 0.0
}