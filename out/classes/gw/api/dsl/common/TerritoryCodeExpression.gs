package gw.api.dsl.common
uses gw.api.builder.TerritoryCodeBuilder
uses gw.api.productmodel.PolicyLinePattern

class TerritoryCodeExpression<E extends TerritoryCodeExpression, B extends TerritoryCodeBuilder> extends DataBuilderExpression<B> {

  construct() {
    super(new B())
  }

  function withPolicyLinePattern(pattern : PolicyLinePattern) : E {
    _builder.withPolicyLinePattern(pattern)
    return this as E
  }

  function withCode(code : String) : E {
    _builder.withCode(code)
    return this as E
  }
}
