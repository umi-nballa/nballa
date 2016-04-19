package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
@java.lang.SuppressWarnings("generated warnings")
class BP7AddlInsdBldgOwnersScheduledItemExpression extends DataBuilderExpression<BP7LocSchedCovItemBuilder> {

  
  construct() {
    super(new BP7LocSchedCovItemBuilder())
  }
  
  function with(clauseExpression : DataBuilderExpression) : BP7AddlInsdBldgOwnersScheduledItemExpression {
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
  
  function withScheduleNumber(value : java.lang.Integer) : BP7AddlInsdBldgOwnersScheduledItemExpression {
    _builder.withScheduleNumber(value)
    return this
  }
  
  function withAddress(value : String) : BP7AddlInsdBldgOwnersScheduledItemExpression {
    _builder.withStringCol1(value)
    return this
  }
  
  function withBuildingDescription(value : String) : BP7AddlInsdBldgOwnersScheduledItemExpression {
    _builder.withLongStringCol1(value)
    return this
  }
  
}