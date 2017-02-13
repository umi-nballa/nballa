package una.integration.mapping.hpx.helper

uses java.util.List
uses java.util.Map
uses java.util.Map
uses gw.rating.rtm.query.RateBookQueryFilter
uses java.math.BigDecimal
uses gw.rating.rtm.query.RatingQueryFacade
uses gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
uses gw.rating.worksheet.treenode.WorksheetTreeNodeLeaf
uses java.util.HashMap

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 11/30/16
 * Time: 6:37 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXRatingHelper {

  function getConsentToRateTotalPremium(policyPeriod : PolicyPeriod) : double {
    var consentToRate : double = 0.00
    if (policyPeriod.HomeownersLine_HOEExists) {
      var baseCost = policyPeriod.AllCosts.firstWhere( \ elt -> elt typeis HomeownersBaseCost_HOE and elt.HOCostType == typekey.HOCostType_Ext.TC_BASEPREMIUM)
      consentToRate = getRate(policyPeriod, baseCost.NameOfCoverable, "NCRB")
    } else {
      for (cost in policyPeriod.AllCosts) {
        var amount = getRate(policyPeriod, cost.NameOfCoverable, "amountWithNoCTR")
        if (amount == null) {
          amount = getRate(policyPeriod, cost.NameOfCoverable, "TermAmount")
        }
        consentToRate = consentToRate + amount
      }
    }
    return consentToRate
  }

  function getConsentToRateTotalDeviationPercent(policyPeriod : PolicyPeriod) : double {
    var totalDeviationFactor : double = 0.00
    if (policyPeriod.HomeownersLine_HOEExists) {
      var baseCost = policyPeriod.AllCosts.firstWhere( \ elt -> elt typeis HomeownersBaseCost_HOE and elt.HOCostType == typekey.HOCostType_Ext.TC_BASEPREMIUM)
      totalDeviationFactor = getRate(policyPeriod, baseCost.NameOfCoverable, "TotalDeviationFactor")
    } else {
      totalDeviationFactor = policyPeriod?.Factor_Ext
    }
    return totalDeviationFactor*100
  }

  function getRate(policyPeriod : PolicyPeriod, ratedItem : String, rateVariable : String) : double {
    var baseRate : double = null
    var containers = getWorksheetContainers(policyPeriod)
    if (ratedItem != null and containers.containsKey(ratedItem)) {
      var container = containers.get(ratedItem)
      var items = getWorksheetVariables(container)
      baseRate = items.get(rateVariable).Result
    } else {
      for (container in containers.values()) {
        var items = getWorksheetVariables(container)
        var item = items.get(rateVariable)
        if (item != null) {
          baseRate = item.Result
          break
        }
      }
    }
    return baseRate
  }

  private function getWorksheetContainers(policyPeriod : PolicyPeriod) : Map<String, WorksheetTreeNodeContainer> {
    var containers = new HashMap<String, WorksheetTreeNodeContainer>()
    var worksheets = policyPeriod.Lines*.getWorksheetRootNode(true)
    for (worksheet in worksheets) {
      worksheet.Children.each( \ elt -> {
        var container = elt.Data as WorksheetTreeNodeContainer
        containers.put(container.Description, container)
      })
    }
    return containers
  }

  private function getWorksheetVariables(container : WorksheetTreeNodeContainer) : Map<String,WorksheetTreeNodeLeaf> {
    var worksheetItems = new HashMap<String,WorksheetTreeNodeLeaf>()
    for (item in container.Children) {
      if (item typeis gw.rating.worksheet.treenode.WorksheetTreeNodeLeaf) {
        worksheetItems.put(item.Instruction, item)
      }
    }
    return worksheetItems
  }


  function getRatingFactor(policyPeriod : PolicyPeriod, table : String, jurisdictionState : String, input : int) : BigDecimal {
    var minimumRatingLevel = typekey.RateBookStatus.TC_STAGE
    var filter = new RateBookQueryFilter(policyPeriod.PeriodStart, policyPeriod.PeriodEnd, policyPeriod.HomeownersLine_HOE.PatternCode)
        {: Jurisdiction = jurisdictionState,
           : MinimumRatingLevel = minimumRatingLevel}
    var factor = new RatingQueryFacade().getFactor(filter, table, {input})
    return factor.Factor as BigDecimal
  }

  function getRatingFactor(policyPeriod : PolicyPeriod, table : String, jurisdictionState : String, input : List<String>) : BigDecimal {
    var minimumRatingLevel = typekey.RateBookStatus.TC_STAGE
    var filter = new RateBookQueryFilter(policyPeriod.PeriodStart, policyPeriod.PeriodEnd, policyPeriod.HomeownersLine_HOE.PatternCode)
        {: Jurisdiction = jurisdictionState,
            : MinimumRatingLevel = minimumRatingLevel}
    var factor = new RatingQueryFacade().getFactor(filter, table, input)
    return factor.Factor as BigDecimal
  }

  function getRatingFactors(policyPeriod : PolicyPeriod, table : String, jurisdictionState : String, input : List<int>) : Map<String, BigDecimal> {
    var minimumRatingLevel = typekey.RateBookStatus.TC_STAGE
    var filter = new RateBookQueryFilter(policyPeriod.PeriodStart, policyPeriod.PeriodEnd, policyPeriod.HomeownersLine_HOE.PatternCode)
        {: Jurisdiction = jurisdictionState,
            : MinimumRatingLevel = minimumRatingLevel}
    var factors = new RatingQueryFacade().getAllFactors(filter, table, input)
    return factors as Map<String, BigDecimal>
  }
}