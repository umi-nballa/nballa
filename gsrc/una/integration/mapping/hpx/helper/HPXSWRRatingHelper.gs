package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 5:56 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXSWRRatingHelper {

  function getEstimatedSWRDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var secondaryWaterResistanceEstimatedDiscounts = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOrOverride < 2001 ? getSWRDiscountsForPre2001BuiltHomes(policyPeriod) : getSWRDiscountsForPost2001BuiltHomes(policyPeriod)
    return secondaryWaterResistanceEstimatedDiscounts
  }

  function getSWRDiscountsForPre2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getSWRConnectionPre2001SWR(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getSWRConnectionPre2001NoSWR(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getSWRDiscountsForPost2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    return roofCoveringEstimatedDiscounts
  }

  function getSWRConnectionPre2001SWR(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Other Roof", "SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_SWR_SWR", "Maximum Discount for SWR SWR")
  }

  function getSWRConnectionPre2001NoSWR(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_SWR_NO_SWR", "Maximum Discount for SWR No SWR")
  }
}