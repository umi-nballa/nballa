package una.integration.mapping.hpx.common

uses gw.rating.rtm.RateBookEnhancement
uses gw.financials.PolicyPeriodFXRateCache
uses gw.lob.ho.rating.HomeownersBaseCostData_HOE
uses java.util.HashMap
uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses gw.rating.rtm.query.RateBookQueryFilter
uses java.math.BigDecimal
uses gw.rating.rtm.query.RatingQueryFacade

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 11/30/16
 * Time: 6:37 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRatingHelper {
  function getBaseRate(policyPeriod : PolicyPeriod, ratedItem : String) : double {
    var baseRate : double = null
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
        if (container.Description.equals(ratedItem)) {
          var items = container.Children
          for (item in items) {
            if (item typeis gw.rating.worksheet.treenode.WorksheetTreeNodeLeaf) {
              if (item.Instruction?.equals("BaseRate")) {
                baseRate = item.Result
                break
              }
            }
          }
        }
      })
    }
    return baseRate
  }

  function getBasis(policyPeriod : PolicyPeriod, ratedItem : String) : double {
    var baseRate : double = null
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
        if (container.Description.equals(ratedItem)) {
          var items = container.Children
          for (item in items) {
            if (item typeis gw.rating.worksheet.treenode.WorksheetTreeNodeLeaf) {
              if (item.Instruction?.equals("Basis")) {
                baseRate = item.Result
                break
              }
            }
          }
        }
      })
    }
    return baseRate
  }

  function getContainers(policyPeriod : PolicyPeriod) : java.util.List<String> {
    var containers = new java.util.ArrayList<String>()
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
        containers.add(container.Description)
      })
    }
    return containers
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

  function getRatingFactor(policyPeriod : PolicyPeriod, table : String, jurisdictionState : String, input : int) : BigDecimal {
    var minimumRatingLevel = typekey.RateBookStatus.TC_STAGE
    var filter = new RateBookQueryFilter(policyPeriod.PeriodStart, policyPeriod.PeriodEnd, policyPeriod.HomeownersLine_HOE.PatternCode)
        {: Jurisdiction = jurisdictionState,
           : MinimumRatingLevel = minimumRatingLevel}
    var factor = new RatingQueryFacade().getFactor(filter, table, {input})
    return factor.Factor as BigDecimal
  }

  function getSouthCarolinaMaximumInsuranceScoreSurcharge(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var maximumSurcharge = new HPXEstimatedDiscount()
    var ratingInfo = new HOCommonBasePremiumRatingInfo(policyPeriod.HomeownersLine_HOE.Dwelling)
    var creditScore = ratingInfo.CreditScore
    var ratingFactor = getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, creditScore)
    var maxRatingFactor = getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, 350)
    maximumSurcharge.Percent = (ratingFactor != null ? maxRatingFactor - ratingFactor : maxRatingFactor - 1)*100
    maximumSurcharge.Code = "SC_MAX_INSCORE_SURCHARGE"
    maximumSurcharge.Description = "Maximum Surcharge if Insurance Score is decreased"
    return maximumSurcharge
  }

  function getSouthCarolinaMaximumInsuranceScoreDiscount(policyPeriod : PolicyPeriod) : HPXEstimatedDiscount {
    var maximumDiscount = new HPXEstimatedDiscount()
    var ratingInfo = new HOCommonBasePremiumRatingInfo(policyPeriod.HomeownersLine_HOE.Dwelling)
    var creditScore = ratingInfo.CreditScore
    var ratingFactor = getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, creditScore)
    var minRatingFactor = getRatingFactor(policyPeriod, "ho_insurance_credit_score_factors", typekey.Jurisdiction.TC_SC, 997)
    maximumDiscount.Percent = (ratingFactor != null ? ratingFactor - minRatingFactor : 1 - minRatingFactor)*100
    maximumDiscount.Code = "SC_MAX_INSCORE_DISCOUNT"
    maximumDiscount.Description = "Maximum Discount if Insurance Score is increased"
    return maximumDiscount
  }
}