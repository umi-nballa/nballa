package gw.api.dsl.bp7.assertions
uses java.util.Date
uses java.math.BigDecimal
uses gw.lob.bp7.financials.BP7BlanketQuoteCostFilter
uses java.math.RoundingMode

class BP7CostsSliceAssertion extends org.fest.assertions.Assertions {

  var _sliceDate : Date
  var _filter : BP7BlanketQuoteCostFilter
  
  construct(sliceDate : Date, filter : BP7BlanketQuoteCostFilter) {
    _sliceDate = sliceDate
    _filter = filter
  }

  function hasBlanketAverageRate(expectedAverageRate : BigDecimal) : BP7CostsSliceAssertion {
    var actualAverageRate = roundRate(_filter.blanketAverageRate(_sliceDate))

    assertThat(actualAverageRate)
      .as("Incorrect blanket average rate.")
      .isEqualTo(expectedAverageRate)

    return this
  }
  
  function hasCombinedBlanketType() : BP7CostsSliceAssertion {
    hasBlanketType(BP7BlktType.TC_BUILDINGANDBUSINESSPERSONALPROPERTYCOMBINED)
    return this
  }
  
  function hasBuildingBlanketType() : BP7CostsSliceAssertion {
    hasBlanketType(BP7BlktType.TC_BUILDINGONLY)
    return this
  }
  
  function hasClassificationBlanketType() : BP7CostsSliceAssertion {
    hasBlanketType(BP7BlktType.TC_BUSINESSPERSONALPROPERTYONLY)
    return this
  }
  
  private function hasBlanketType(blanketType : BP7BlktType) {
    assertThat(_filter.blanketType(_sliceDate))
      .as("Incorrect blanket type.")
      .isEqualTo(blanketType.DisplayName)
  }

  function hasBlanketedCosts(count : int) : BP7CostsSliceAssertion {
    assertThat(_filter.effBlanketedCosts(_sliceDate).Count)
      .as("Incorrect number of blanketed costs")
      .isEqualTo(count)
    return this
  }

  private function roundRate(cost : BigDecimal) : BigDecimal {
    return cost.setScale(3, RoundingMode.HALF_UP)
  }
}
