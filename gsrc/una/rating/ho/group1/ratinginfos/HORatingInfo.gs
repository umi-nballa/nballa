package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HORatingInfo extends una.rating.ho.common.HORatingInfo  {
  var _keyPremium: BigDecimal as KeyPremium = 0.0
  var _standardBaseClassPremium: BigDecimal as StandardBaseClassPremium = 0.0
  var _finalAdjustedBaseClassPremium: BigDecimal as FinalAdjustedBaseClassPremium = 0.0
  var _differenceInConditions: BigDecimal as DifferenceInConditions = 0.0
  var _higherAllPerilDeductible: BigDecimal as HigherAllPerilDeductible = 0.0
  var _concreteTileRoofDiscount: BigDecimal as ConcreteTileRoofDiscount = 0.0
  var _seasonalSecondaryResidenceSurcharge: BigDecimal as SeasonalSecondaryResidenceSurcharge = 0.0
  var _gatedCommunityDiscount: BigDecimal as GatedCommunityDiscount = 0.0
  var _privateFireCompanyDiscount: BigDecimal as PrivateFireCompanyDiscount = 0.0
}