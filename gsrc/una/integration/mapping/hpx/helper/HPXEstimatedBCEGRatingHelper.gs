package una.integration.mapping.hpx.helper

uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 6/30/17
 * Time: 8:43 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXEstimatedBCEGRatingHelper {
  function getEstimatedDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var estimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    var jurisdictionState = policyPeriod.BaseState
    if (jurisdictionState == typekey.Jurisdiction.TC_AZ and policyPeriod.HomeownersLine_HOEExists) {
      estimatedDiscounts.add(getEstimatedMaximiumBCEGDiscountAZ(policyPeriod))
      estimatedDiscounts.add(getEstimatedMaximumBCEGSurchargeAZ(policyPeriod))
    }
    return estimatedDiscounts
  }

  function getEstimatedMaximiumBCEGDiscountAZ(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactorForGenericInput(policyPeriod, "ho_building_code_effectiveness_grading_windstorm_hail_factors", typekey.Jurisdiction.TC_AZ, {policyPeriod.HomeownersLine_HOE.Dwelling.HOLine.HOPolicyType, 40, 1})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "MAX_BCEG_DISCOUNT", "Maximum Discount for BCEG")
  }

  function getEstimatedMaximumBCEGSurchargeAZ(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var estimatedDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingFactor = ratingHelper.getRatingFactorForGenericInput(policyPeriod, "ho_building_code_effectiveness_grading_windstorm_hail_factors", typekey.Jurisdiction.TC_AZ, {policyPeriod.HomeownersLine_HOE.Dwelling.HOLine.HOPolicyType, 40, 10})
    return estimatedDiscount.getEstimatedDiscount(ratingFactor, 0.00, "MIN_BCEG_DISCOUNT", "Minimum Discount for BCEG")
  }

}