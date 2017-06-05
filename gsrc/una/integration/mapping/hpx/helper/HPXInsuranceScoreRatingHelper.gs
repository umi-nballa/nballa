package una.integration.mapping.hpx.helper

uses java.util.HashMap
uses java.util.Map
uses gw.rating.rtm.RateBookEnhancement
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses java.math.BigDecimal
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 1/17/17
 * Time: 1:54 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXInsuranceScoreRatingHelper {

  function getEstimatedDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount> {
    var estimatedDiscounts = new ArrayList<HPXEstimatedDiscount>()
    var jurisdictionState = policyPeriod.BaseState
    switch (jurisdictionState) {
      case typekey.Jurisdiction.TC_SC :
          estimatedDiscounts.add(getSouthCarolinaMaximumInsuranceScoreDiscount(policyPeriod))
          estimatedDiscounts.add(getSouthCarolinaMaximumInsuranceScoreSurcharge(policyPeriod))
          break
      case typekey.Jurisdiction.TC_NV :
          estimatedDiscounts.add(getNevadaMaximumInsuranceScoreDiscount(policyPeriod))
          estimatedDiscounts.add(getNevadaMaximumInsuranceScoreSurcharge(policyPeriod))
          break
    }
    return estimatedDiscounts
  }

  function getRateForInsuranceScore(period : PolicyPeriod, score : int) {
    // Credit Score
    var ratebook = RateBookEnhancement.selectRateBook(new java.util.Date(), new java.util.Date(), typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE, typekey.Jurisdiction.TC_NC, typekey.RateBookStatus.TC_STAGE, false, null, null)
    var calcRoutine = ratebook.getCalcRoutine("ho_homeowners_insurance_score_max_discount")
    var dateRange = period.SliceDateRange
    var rateCache = new PolicyPeriodFXRateCache(period)
    var costData = new HomeownersBaseCostData_HOE(dateRange.Start, dateRange.End, period.PreferredCoverageCurrency, rateCache, HOCostType_Ext.TC_BASEPREMIUM)
    costData.init(period.HomeownersLine_HOE)
    var ratingInfo = new HOCommonBasePremiumRatingInfo(period.HomeownersLine_HOE.Dwelling)
    ratingInfo.CreditScore = score
    var parameterMap = new HashMap<CalcRoutineParamName, Object>()  {
    TC_POLICYLINE -> period.HomeownersLine_HOE,
    TC_DWELLINGRATINGINFO_EXT -> ratingInfo,
    TC_STATE -> null,
    TC_RATINGINFO -> null
  }
    parameterMap.put(TC_COSTDATA, costData)
    ratebook.executeCalcRoutine(calcRoutine.Code, costData, costData, parameterMap)
    print(costData.ActualBaseRate)
  }

  function getSouthCarolinaMaximumInsuranceScoreSurcharge(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var maximumSurcharge = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingInfo = new HOCommonBasePremiumRatingInfo(policyPeriod.HomeownersLine_HOE.Dwelling)
    var creditScore = ratingInfo.CreditScore
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, creditScore)
    var maxRatingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, 350)
    maximumSurcharge.Percent = (ratingFactor != null ? maxRatingFactor - ratingFactor : maxRatingFactor - 1)*100
    maximumSurcharge.Code = "MAX_INSCORE_SURCHARGE"
    maximumSurcharge.Description = "Maximum Surcharge if Insurance Score is decreased"
    return maximumSurcharge
  }

  function getSouthCarolinaMaximumInsuranceScoreDiscount(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var maximumDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingInfo = new HOCommonBasePremiumRatingInfo(policyPeriod.HomeownersLine_HOE.Dwelling)
    var creditScore = ratingInfo.CreditScore
    var ratingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, creditScore)
    var minRatingFactor = ratingHelper.getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, 997)
    maximumDiscount.Percent = (ratingFactor != null ? ratingFactor - minRatingFactor : 1 - minRatingFactor)*100
    maximumDiscount.Code = "MAX_INSCORE_DISCOUNT"
    maximumDiscount.Description = "Maximum Discount if Insurance Score is increased"
    return maximumDiscount
  }

  function getNevadaMaximumInsuranceScoreSurcharge(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var maximumSurcharge = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingInfo = new HOCommonBasePremiumRatingInfo(policyPeriod.HomeownersLine_HOE.Dwelling)
    var creditScore = ratingInfo.CreditScore
    var numYears = ratingInfo.ConsecutiveYrsWithUniversal
    var numLosses = ratingInfo.PriorLosses
    var ratingFactors = ratingHelper.getRatingFactors(policyPeriod, "ho_customer_matrix_factors_una", typekey.Jurisdiction.TC_NV, {numYears, creditScore, numLosses} )
    var ratingFactor = ratingFactors.get("factor")
    var maxRatingFactors = ratingHelper.getRatingFactors(policyPeriod, "ho_customer_matrix_factors_una", typekey.Jurisdiction.TC_NV, {0, 0, 100} )
    var maxRatingFactor = maxRatingFactors.get("factor")
    maximumSurcharge.Percent = (ratingFactor != null ? maxRatingFactor - ratingFactor : maxRatingFactor - 1)*100
    maximumSurcharge.Code = "MAX_INSCORE_SURCHARGE"
    maximumSurcharge.Description = "Maximum Surcharge if Insurance Score is decreased"
    return maximumSurcharge
  }

  function getNevadaMaximumInsuranceScoreDiscount(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var maximumDiscount = new HPXEstimatedDiscount()
    var ratingHelper = new HPXRatingHelper()
    var ratingInfo = new HOCommonBasePremiumRatingInfo(policyPeriod.HomeownersLine_HOE.Dwelling)
    var creditScore = ratingInfo.CreditScore
    var numYears = ratingInfo.ConsecutiveYrsWithUniversal
    var numLosses = ratingInfo.PriorLosses
    var ratingFactors = ratingHelper.getRatingFactors(policyPeriod, "ho_customer_matrix_factors_una", typekey.Jurisdiction.TC_NV, {numYears, creditScore, numLosses} )
    var ratingFactor = ratingFactors.get("factor")
    var minRatingFactors = ratingHelper.getRatingFactors(policyPeriod, "ho_customer_matrix_factors_una", typekey.Jurisdiction.TC_NV, {9,997 ,0} )
    var minRatingFactor = minRatingFactors.get("factor")
    maximumDiscount.Percent = (ratingFactor != null ? ratingFactor - minRatingFactor : 1 - minRatingFactor)*100
    maximumDiscount.Code = "MAX_INSCORE_DISCOUNT"
    maximumDiscount.Description = "Maximum Discount if Insurance Score is increased"
    return maximumDiscount
  }
}