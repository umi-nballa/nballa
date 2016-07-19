package una.rating.ho

uses java.math.BigDecimal
/**
 * User: bduraiswamy
 * Date: 6/16/16
 * custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HORatingInfo {

  var _standardBaseClassPremium : BigDecimal as StandardBaseClassPremium
  var _adjustedBaseClassPremium : BigDecimal as AdjustedBaseClassPremium
  var _finalBaseClassPremium : BigDecimal as FinalBaseClassPremium
}