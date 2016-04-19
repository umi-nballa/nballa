package gw.api.dsl.bp7.assertions
uses java.math.BigDecimal
uses gw.lob.bp7.financials.BP7QuoteCostFilter
uses java.math.RoundingMode
uses gw.lob.bp7.financials.BP7CostDisplayable
uses gw.lob.bp7.financials.BP7Qualifier
uses java.util.Date
uses gw.lob.bp7.financials.BP7BlanketQuoteCostFilter

class BP7CostsAssertion extends org.fest.assertions.Assertions {

  var _filter : BP7QuoteCostFilter
  var _blanketFilter : BP7BlanketQuoteCostFilter

  construct(period : PolicyPeriod) {
    _filter = new BP7QuoteCostFilter(period.BP7Line.AllCostsWindowMode)
    _blanketFilter = new BP7BlanketQuoteCostFilter(period.BP7Line.AllCostsWindowMode)
  }
  
  function forSlice(sliceDate : Date) : BP7CostsSliceAssertion {
    return new BP7CostsSliceAssertion(sliceDate, _blanketFilter)
  }

  function hasBlanketedBuildingPremium(totalPremium : BigDecimal) : BP7CostsAssertion {
    var costs : List<BP7CostDisplayable> = {}
    _filter.children(new BP7Qualifier("/")).each(\ location -> {
      costs.addAll(_filter.coverageCosts(_filter.children(location)))
    })
    var sum = costs
      .where(\ cost -> cost.DisplayBlanketed)
      .sum(\ cost -> cost.DisplayActualAmount)

    assertSum(sum, totalPremium)
    return this
  }
  
  function hasBlanketedClassificationPremium(totalPremium : BigDecimal) : BP7CostsAssertion {
    var costs : List<BP7CostDisplayable> = {}
    _filter.children(new BP7Qualifier("/")).each(\ location -> {
      _filter.children(location).each(\ building -> {
        costs.addAll(_filter.coverageCosts(_filter.children(building)))
      })
    })
    var sum = costs
      .where(\ cost -> cost.DisplayBlanketed)
      .sum(\ cost -> cost.DisplayActualAmount)
    
    assertSum(sum, totalPremium)
    return this
  }

  private function assertSum(actualSum : BigDecimal, expectedSum : BigDecimal) {
    assertThat(roundDollar(actualSum))
      .as("Unexpected sum for costs.")
      .isEqualTo(roundDollar(expectedSum))
  }
  
  private function roundDollar(cost : BigDecimal) : BigDecimal {
    return cost.setScale(0, RoundingMode.HALF_UP)
  }
 
}
