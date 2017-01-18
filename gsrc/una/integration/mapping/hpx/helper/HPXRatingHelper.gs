package una.integration.mapping.hpx.helper

uses java.util.List
uses java.util.Map
uses java.util.Map
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