package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal



/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HORatingInfo {
  var _standardBaseClassPremium: BigDecimal as StandardBaseClassPremium = 0.0
  var _adjustedBaseClassPremium: BigDecimal as AdjustedBaseClassPremium = 0.0
  var _finalAdjustedBaseClassPremium: BigDecimal as FinalAdjustedBaseClassPremium = 0.0
  var _replacementCostDwellingPremium: BigDecimal as ReplacementCostDwellingPremium = 0.0
  var _replacementCostPersonalPropertyPremium: BigDecimal as ReplacementCostPersonalPropertyPremium = 0.0
  var _hoaPlusCoveragePremium: BigDecimal as HOAPlusCoveragePremium = 0.0
  var _totalBasePremium: BigDecimal as TotalBasePremium = 0.0
  //discounts
  var _ageOfHomeDiscount: BigDecimal as AgeOfHomeDiscount = 0.0
  var _burglarProtectiveDevicesCredit: BigDecimal as BurglarProtectiveDevicesCredit = 0.0
  var _fireProtectiveDevicesCredit: BigDecimal as FireProtectiveDevicesCredit = 0.0
  var _hailResistantRoofCredit: BigDecimal as HailResistantRoofCredit = 0.0
  var _affinityDiscount: BigDecimal as AffinityDiscount = 0.0
}