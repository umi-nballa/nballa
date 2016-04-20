package gw.api.dsl.bp7.expressions
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.databuilder.bp7.BP7BlanketBuilder
uses gw.api.dsl.common.EntityRetriever
uses java.math.BigDecimal

class BP7BlanketExpression extends DataBuilderExpression<BP7BlanketBuilder> {
  construct() {
    super(new BP7BlanketBuilder())
  }  

  function withBlanketType(blanketType : typekey.BP7BlktType) : BP7BlanketExpression {
    _builder.withBlanketType(blanketType)
    return this
  }

  function withBlanketLimit(blanketLimit : BigDecimal) : BP7BlanketExpression {
    _builder.withBlanketLimit(blanketLimit)
    return this
  }

  function fromPeriod(period : PolicyPeriod) : BP7Blanket {
    return new EntityRetriever<BP7Blanket>(_builder).fromPeriod(period)
  }
}
