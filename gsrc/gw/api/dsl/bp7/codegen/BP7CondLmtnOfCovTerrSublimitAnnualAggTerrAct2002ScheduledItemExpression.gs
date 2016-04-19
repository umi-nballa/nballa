package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
@java.lang.SuppressWarnings("generated warnings")
class BP7CondLmtnOfCovTerrSublimitAnnualAggTerrAct2002ScheduledItemExpression extends DataBuilderExpression<BP7LineSchedCondItemBuilder> {

  
  construct() {
    super(new BP7LineSchedCondItemBuilder())
  }
  
  function with(clauseExpression : DataBuilderExpression) : BP7CondLmtnOfCovTerrSublimitAnnualAggTerrAct2002ScheduledItemExpression {
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
  
  function withScheduleNumber(value : java.lang.Integer) : BP7CondLmtnOfCovTerrSublimitAnnualAggTerrAct2002ScheduledItemExpression {
    _builder.withScheduleNumber(value)
    return this
  }
  
  function withDescOfPropOrCov(value : String) : BP7CondLmtnOfCovTerrSublimitAnnualAggTerrAct2002ScheduledItemExpression {
    _builder.withLongStringCol1(value)
    return this
  }
  
  function withStates(value : String) : BP7CondLmtnOfCovTerrSublimitAnnualAggTerrAct2002ScheduledItemExpression {
    _builder.withStringCol1(value)
    return this
  }
  
}