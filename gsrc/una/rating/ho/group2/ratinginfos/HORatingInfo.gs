package una.rating.ho.group2.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {
  var _windHailCredit: BigDecimal as WindHailExclusionCredit = 0.0
}