package una.rating.ho.group2.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {
  var _windHailCredit: BigDecimal as WindHailExclusionCredit = 0.0
  var _keyFactor : BigDecimal as KeyFactor = 0.0
  var _higherAllPeril : BigDecimal as HigherAllPerilDeductible = 0.0
  var _gatedCommunity : BigDecimal as GatedCommunity = 0.0
}