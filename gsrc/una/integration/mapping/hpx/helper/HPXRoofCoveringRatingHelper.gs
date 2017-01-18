package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 3:26 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRoofCoveringRatingHelper extends HPXHurricaneLossMitigationHelper {

  function getEstimatedRoofCoveringDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOrOverride < 2011 ? getRoofCoveringDiscountsForPre2001BuiltHomes(policyPeriod) : getRoofCoveringDiscountsForPost2001BuiltHomes(policyPeriod)
    return roofCoveringEstimatedDiscounts
  }

  function getRoofCoveringDiscountsForPre2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getRoofCoveringPre2001FBS(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofCoveringPre2001ReinforcedConcreteRoofDeck(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getRoofCoveringDiscountsForPost2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    return roofCoveringEstimatedDiscounts
  }

  function getRoofCoveringPre2001FBS(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"FBC", "A", "Toe Nails", "None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_COVERING_FBC_DISCOUNT", "Maximum Discount Roof Covering FBC")
  }

  function getRoofCoveringPre2001ReinforcedConcreteRoofDeck(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_existing_reinforced_concrete_terrain_b_fl", typekey.Jurisdiction.TC_FL, {"None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_COVERING_REINFORCED_CONCRETE_ROOF_DECK_DISCOUNT", "Maximum Discount Reinforced concrete Roof Covering")
  }
}