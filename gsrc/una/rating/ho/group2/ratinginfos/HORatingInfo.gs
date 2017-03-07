package una.rating.ho.group2.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Gosu class which stores the base premium, discounts and credits
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo {
  var _keyFactor : BigDecimal as KeyFactor = 0.0
  var _windHailCredit: BigDecimal as WindHailExclusionCredit = 0.0
  var _higherAllPeril : BigDecimal as HigherAllPerilDeductible = 0.0
  var _gatedCommunityDiscount: BigDecimal as GatedCommunityDiscount = 0.0
  var _affinityDiscount : BigDecimal as AffinityDiscount = 0.0
  var _concreteTileRoofDiscount: BigDecimal as ConcreteTileRoofDiscount = 0.0
  var _townhouseOrRowhouseSurcharge : BigDecimal as TownhouseOrRowhouseSurcharge = 0.0
  var _buildingCodeEffectivenessGradingCredit : BigDecimal as BuildingCodeEffectivenessGradingCredit = 0.0
  var _lossHistoryRatingPlan : BigDecimal as LossHistoryRatingPlan = 0.0
  var _windstormMitigationCredit : BigDecimal as WindstormMitigationCredit = 0.0
  var _namedStormDeductibleCredit : BigDecimal as NamedStormDeductibleCredit = 0.0
}