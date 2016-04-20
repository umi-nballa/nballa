package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
@java.lang.SuppressWarnings("generated warnings")
class BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression extends DataBuilderExpression<BP7LineSchedExclItemBuilder> {

  
  construct() {
    super(new BP7LineSchedExclItemBuilder())
  }
  
  function with(clauseExpression : DataBuilderExpression) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression {
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
  
  function withScheduleNumber(value : java.lang.Integer) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression {
    _builder.withScheduleNumber(value)
    return this
  }
  
  function withBodilyInjuryExcluded(value : boolean) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression {
    _builder.withBoolCol3(value)
    return this
  }
  
  function withPropertyDamageExcluded(value : boolean) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression {
    _builder.withBoolCol4(value)
    return this
  }
  
  function withPersonalAndAdvertisingInjuryExcluded(value : boolean) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression {
    _builder.withBoolCol5(value)
    return this
  }
  
  function withDescriptionOfLocationsProductsOperationsOrServicesToBeExcluded(value : String) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression {
    _builder.withLongStringCol1(value)
    return this
  }
  
}