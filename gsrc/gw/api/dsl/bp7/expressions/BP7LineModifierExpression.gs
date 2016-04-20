package gw.api.dsl.bp7.expressions

uses gw.api.databuilder.bp7.BP7LineModBuilder
uses gw.api.databuilder.bp7.BP7LineRFBuilder
uses java.lang.Double
uses gw.api.dsl.common.EntityRetriever

class BP7LineModifierExpression {

  var _lineModifierBuilder : BP7LineModBuilder as ModBuilder

  construct() {
    _lineModifierBuilder = new BP7LineModBuilder()
  }

  function withRateFactor(factor : Double, rateFactorType : RateFactorType) : BP7LineModifierExpression {
    var justification : String = null
    if (factor != 0) {
      // We set a default justification for a non-zero factor because of the validation. We only need to have a value.
      justification = "test justification"
    }

    var rfbuilder = new BP7LineRFBuilder()
      .withFactor(factor)
      .withType(rateFactorType)
      .withJustification(justification)
    _lineModifierBuilder.addRateFactor(rfbuilder)

    return this
  }

  function fromPeriod(period : PolicyPeriod) : BP7LineMod {
    return new EntityRetriever<BP7LineMod>(_lineModifierBuilder).fromPeriod(period)
  }
}
