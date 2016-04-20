package gw.lob.bp7.financials

uses java.math.BigDecimal
uses java.util.Date

class BP7BlanketQuoteCostFilter {

  var _costs : List<BP7CostDisplayable>

  construct(costs : List<BP7CostDisplayable>) {
    _costs = costs
  }

  function blanketType(sliceDate : Date) : String {
    var costs = effBlanketedCosts(sliceDate)
    return costs.HasElements
      ? costs.sortBy(\ cost -> cost.DisplayEffectiveDate ).last().DisplayBlanket
      : ""
  }

  function blanketAverageRate(sliceDate : Date) : BigDecimal {
    var blanketCosts = effBlanketedCosts(sliceDate)
    return countAverage(blanketCosts)
  }

  function blanketAverageRate(blanket : BP7Blanket) : BigDecimal {
    var blanketCosts = effBlanketedCosts(blanket.EffectiveDate).where( \ cost -> cost.AssociatedBlanket == blanket)
    return countAverage(blanketCosts)
  }

  function countAverage(blanketCosts : List<BP7CostDisplayable>) : BigDecimal{
    if(blanketCosts.Empty) {
      return 0bd
    }

    var totalPremium = blanketCosts.sum(\ cost -> cost.DisplayActualTermAmount)
    var totalBasis = blanketCosts.sum(\ cost -> cost.DisplayBasis)

    return totalPremium / (totalBasis / 100bd)
  }

  function blanketedSlices() : List<BP7Blanket> {
    var costs = _costs.where(\ cost -> cost.DisplayBlanketed)
    if (costs.Empty) return {}

    return costs*.AssociatedBlanket.toSet().toList()
  }

  function effBlanketedCosts(sliceDate : Date) : List<BP7CostDisplayable> {
    return _costs.where(\ cost -> cost.DisplayBlanketed and 
                                  cost.isEffective(sliceDate))
  }
}
