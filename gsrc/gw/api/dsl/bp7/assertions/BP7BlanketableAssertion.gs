
package gw.api.dsl.bp7.assertions
uses gw.lob.bp7.blanket.BP7Blanketable

class BP7BlanketableAssertion extends org.fest.assertions.Assertions {
  
  var _blanketable : BP7Blanketable

  construct(blanketable : BP7Blanketable) {
    _blanketable = blanketable
  }

  function isEligibleForBlanket(blanket : BP7Blanket) {
    assertThat(blanket.EligibleCoverages)
      .as("Eligible coverages for blanket ${blanket.BlanketType}.")
      .contains({_blanketable})
  }
  
  function isNotEligibleForBlanket(blanket : BP7Blanket) {
    assertThat(blanket.EligibleCoverages)
      .as("Eligible coverages for blanket ${blanket.BlanketType}.")
      .excludes({_blanketable})
  }
}
