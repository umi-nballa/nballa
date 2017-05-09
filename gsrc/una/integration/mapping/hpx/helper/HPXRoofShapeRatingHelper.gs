package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 5:41 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRoofShapeRatingHelper {

  function getEstimatedRoofShapeDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofShapeEstimatedDiscounts = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOrOverride < 2001 ? getRoofShapeDiscountsForPre2001BuiltHomes(policyPeriod) : getRoofShapeDiscountsForPost2001BuiltHomes(policyPeriod)
    return roofShapeEstimatedDiscounts
  }

  function getRoofShapeDiscountsForPre2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getRoofShapePre2001HipRoof(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofShapePre2001OtherRoof(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getRoofShapeDiscountsForPost2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getRoofShapePost2001HipRoof(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofShapePost2001OtherRoof(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getRoofShapePre2001HipRoof(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Hip Roof", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_SHAPE_HIP_ROOF_DISCOUNT", "Maximum Discount Roof Shape Hip Roof")
  }

  function getRoofShapePre2001OtherRoof(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Other Roof", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_SHAPE_OTHER_ROOF_DISCOUNT", "Maximum Discount Roof Shape Other Roof")
  }

  function getRoofShapePost2001HipRoof(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_credits_new_construction_hip_roof_shape_nonhvhz", typekey.Jurisdiction.TC_FL, {typekey.RoofDecking_Ext.TC_OTHERROOFDECK.DisplayName, typekey.Terrain_Ext.TC_TERRAINB.DisplayName, typekey.FBCWindSpeed_Ext.TC_110.DisplayName, typekey.WindSpeedOfDesign_Ext.TC_GREATERTHANOREQUAL110.DisplayName, typekey.InternalPressureDsgn_Ext.TC_ENCLOSED.DisplayName, "NO", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName, typekey.OpeningProtection_Ext.TC_NONE.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "POST_2001_MAX_ROOF_SHAPE_HIP_ROOF_DISCOUNT", "Maximum Discount Roof Shape Hip Roof")
  }

  function getRoofShapePost2001OtherRoof(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_credits_new_construction_other_roof_shape_nonhvhz", typekey.Jurisdiction.TC_FL, {typekey.RoofDecking_Ext.TC_OTHERROOFDECK.DisplayName, typekey.Terrain_Ext.TC_TERRAINB.DisplayName, typekey.FBCWindSpeed_Ext.TC_110.DisplayName, typekey.WindSpeedOfDesign_Ext.TC_GREATERTHANOREQUAL110.DisplayName, typekey.InternalPressureDsgn_Ext.TC_ENCLOSED.DisplayName, "NO", typekey.SecondaryWaterResis_Ext.TC_NOSWR.DisplayName, typekey.OpeningProtection_Ext.TC_NONE.DisplayName})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "POST_2001_MAX_ROOF_SHAPE_OTHER_ROOF_DISCOUNT", "Maximum Discount Roof Shape Other Roof")
  }
}