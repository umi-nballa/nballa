package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
@java.lang.SuppressWarnings("generated warnings")
class BP7PhotographyScheduledItemExpression extends DataBuilderExpression<BP7LineSchedCovItemBuilder> {

  
  construct() {
    super(new BP7LineSchedCovItemBuilder())
  }
  
  function with(clauseExpression : DataBuilderExpression) : BP7PhotographyScheduledItemExpression {
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
  
  function withScheduleNumber(value : java.lang.Integer) : BP7PhotographyScheduledItemExpression {
    _builder.withScheduleNumber(value)
    return this
  }
  
  function withDescriptionOfEquipment(value : String) : BP7PhotographyScheduledItemExpression {
    _builder.withStringCol2(value)
    return this
  }
  
  function withMake(value : String) : BP7PhotographyScheduledItemExpression {
    _builder.withStringCol1(value)
    return this
  }
  
  function withModelNumber(value : String) : BP7PhotographyScheduledItemExpression {
    _builder.withStringCol3(value)
    return this
  }
  
  function withSerialNumber(value : String) : BP7PhotographyScheduledItemExpression {
    _builder.withStringCol4(value)
    return this
  }
  
}