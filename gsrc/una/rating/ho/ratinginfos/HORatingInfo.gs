package una.rating.ho.ratinginfos

uses java.math.BigDecimal


/**
 * User: bduraiswamy
 * Date: 6/16/16
 * custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HORatingInfo {

  var _standardBaseClassPremium : BigDecimal as StandardBaseClassPremium = 0.0
  var _adjustedBaseClassPremium : BigDecimal as AdjustedBaseClassPremium = 0.0
  var _finalAdjustedBaseClassPremium : BigDecimal as FinalAdjustedBaseClassPremium = 0.0
  var _replacementCostDwellingPremium : BigDecimal as ReplacementCostDwellingPremium = 0.0

  var _totalBasePremium : BigDecimal as TotalBasePremium = 0.0
}