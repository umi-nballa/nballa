package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 5:34 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRootToWallRatingHelper {

  function getEstimatedRoofToWallDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOrOverride < 2001 ? getRoofToWallDiscountsForPre2001BuiltHomes(policyPeriod) : getRoofToWallDiscountsForPost2001BuiltHomes(policyPeriod)
    return roofCoveringEstimatedDiscounts
  }

  function getRoofToWallDiscountsForPre2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getRoofToWallConnectionPre2001ToeNails(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofToWallConnectionPre2001UsingClips(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofToWallConnectionPre2001SingleWraps(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofToWallConnectionPre2001DoubleWraps(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getRoofToWallDiscountsForPost2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    return roofCoveringEstimatedDiscounts
  }

  function getRoofToWallConnectionPre2001ToeNails(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Other Roof", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_TO_WALL_TOE_NAILS", "Maximum Discount for Roof to Wall Toe Nails")
  }

  function getRoofToWallConnectionPre2001UsingClips(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Clips", "None", "Other Roof", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_TO_WALL_USING_CLIPS", "Maximum Discount for Roof to Wall Using Clips")
  }

  function getRoofToWallConnectionPre2001SingleWraps(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Single Wraps", "None", "Other Roof", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_TO_WALL_SINGLE_WRAPS", "Maximum Discount for Roof to Wall Single Wraps")
  }

  function getRoofToWallConnectionPre2001DoubleWraps(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Double Wraps", "None", "Other Roof", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_TO_WALL_DOUBLE_WRAPS", "Maximum Discount for Roof to Wall Double Wraps")
  }
}