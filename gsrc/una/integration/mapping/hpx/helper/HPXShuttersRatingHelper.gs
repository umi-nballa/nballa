package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 6:03 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXShuttersRatingHelper {

  function getEstimatedShuttersDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var shuttersEstimatedDiscounts = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOrOverride < 2011 ? getShuttersDiscountsForPre2001BuiltHomes(policyPeriod) : getShuttersDiscountsForPost2001BuiltHomes(policyPeriod)
    return shuttersEstimatedDiscounts
  }

  function getShuttersDiscountsForPre2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getShuttersConnectionPre2001None(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getShuttersConnectionPre2001Intermediate(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getShuttersConnectionPre2001HurricaneProtection(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getShuttersDiscountsForPost2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    return roofCoveringEstimatedDiscounts
  }

  function getShuttersConnectionPre2001None(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_SHUTTERS_NONE", "Maximum Discount for Shutters None")
  }

  function getShuttersConnectionPre2001Intermediate(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "Basic - Windows", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_SHUTTERS_INTERMEDIATE", "Maximum Discount for Shutters Intermediate")
  }

  function getShuttersConnectionPre2001HurricaneProtection(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "Hurricane - Windows", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_TO_WALL_SINGLE_WRAPS", "Maximum Discount for Roof to Wall Single Wraps")
  }
}