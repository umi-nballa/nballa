package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 5:28 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRoofAttachmentRatingHelper {

  function getEstimatedRoofAttachmentDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofAttachmentEstimatedDiscounts = policyPeriod.HomeownersLine_HOE.Dwelling.YearBuiltOrOverride < 2001 ? getRoofAttachmentDiscountsForPre2001BuiltHomes(policyPeriod) : getRoofAttachmentDiscountsForPost2001BuiltHomes(policyPeriod)
    return roofAttachmentEstimatedDiscounts
  }

  function getRoofAttachmentDiscountsForPre2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    roofCoveringEstimatedDiscounts.add(getRoofAttachmentPre2001A(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofAttachmentPre2001B(policyPeriod))
    roofCoveringEstimatedDiscounts.add(getRoofAttachmentPre2001C(policyPeriod))
    return roofCoveringEstimatedDiscounts
  }

  function getRoofAttachmentDiscountsForPost2001BuiltHomes(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var roofCoveringEstimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    return roofCoveringEstimatedDiscounts
  }

  function getRoofAttachmentPre2001A(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "A", "Toe Nails", "None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_ATTACHMENT_A_DISCOUNT", "Maximum Discount for Roof Attachment A")
  }

  function getRoofAttachmentPre2001B(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "B", "Toe Nails", "None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_ATTACHMENT_B_DISCOUNT", "Maximum Discount for Roof Attachment B")
  }

  function getRoofAttachmentPre2001C(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_windstorm_loss_reduction_terrain_B_FL", typekey.Jurisdiction.TC_FL, {"Non-FBC", "C", "Toe Nails", "None", "Other Roof", "No SWR"})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "PRE_2001_MAX_ROOF_ATTACHMENT_C_DISCOUNT", "Maximum Discount for Roof Attachment C")
  }
}