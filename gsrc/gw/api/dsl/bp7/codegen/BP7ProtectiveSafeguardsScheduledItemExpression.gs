package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
@java.lang.SuppressWarnings("generated warnings")
class BP7ProtectiveSafeguardsScheduledItemExpression extends DataBuilderExpression<BP7BldgSchedCovItemBuilder> {

  
  construct() {
    super(new BP7BldgSchedCovItemBuilder())
  }
  
  function with(clauseExpression : DataBuilderExpression) : BP7ProtectiveSafeguardsScheduledItemExpression {
    if (clauseExpression typeis DataBuilderExpression<CoverageBuilder>) {
      _builder.withCoverage(clauseExpression.DataBuilder)
    } else if (clauseExpression typeis DataBuilderExpression<ExclusionBuilder>) {
      _builder.withExclusion(clauseExpression.DataBuilder)
    } else if (clauseExpression typeis DataBuilderExpression<PolicyConditionBuilder>) {
      _builder.withCondition(clauseExpression.DataBuilder)
    } else {
      throw "expression provided is not an expression for a clause builder"
    }
    return this
  }
  
  function withScheduleNumber(value : java.lang.Integer) : BP7ProtectiveSafeguardsScheduledItemExpression {
    _builder.withScheduleNumber(value)
    return this
  }
  
  function withSymbol(value : typekey.BP7ProtectiveDeviceOrService) : BP7ProtectiveSafeguardsScheduledItemExpression {
    _builder.withTypeKeyCol1(value.Code)
    return this
  }
  
  function withDescription(value : String) : BP7ProtectiveSafeguardsScheduledItemExpression {
    _builder.withStringCol2(value)
    return this
  }
  
}