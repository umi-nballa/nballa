package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 6:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXHurricaneLossMitigationHelper {
  function getEstimatedDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var estimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    var estimatedRoofCoveringDiscount = new HPXRoofCoveringRatingHelper()
    var estimatedRoofAttachmentDiscount = new HPXRoofAttachmentRatingHelper()
    var estimatedRoofToWallDiscount = new HPXRootToWallRatingHelper()
    var estimatedRoofShapeDiscount = new HPXRoofShapeRatingHelper()
    var estimatedSWRDiscount = new HPXSWRRatingHelper()
    var estimatedShuttersDiscount = new HPXShuttersRatingHelper()
    estimatedDiscounts.addAll(estimatedRoofCoveringDiscount.getEstimatedRoofCoveringDiscounts(policyPeriod))
    estimatedDiscounts.addAll(estimatedRoofAttachmentDiscount.getEstimatedRoofAttachmentDiscounts(policyPeriod))
    estimatedDiscounts.addAll(estimatedRoofToWallDiscount.getEstimatedRoofToWallDiscounts(policyPeriod))
    estimatedDiscounts.addAll(estimatedRoofShapeDiscount.getEstimatedRoofShapeDiscounts(policyPeriod))
    estimatedDiscounts.addAll(estimatedSWRDiscount.getEstimatedSWRDiscounts(policyPeriod))
    estimatedDiscounts.addAll(estimatedShuttersDiscount.getEstimatedShuttersDiscounts(policyPeriod))
    return estimatedDiscounts
  }

}