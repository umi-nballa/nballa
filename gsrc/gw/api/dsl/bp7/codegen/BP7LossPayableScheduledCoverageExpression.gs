package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LossPayableScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7BldgSchedCovItemBuilder>(BP7BldgSchedCov))
    _builder.withPatternCode("BP7LossPayable")
  }
  
  function with(scheduleItem : BP7LossPayableScheduledItemExpression) : BP7LossPayableScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7LossPayableScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7LossPayable {
    return new EntityRetriever<BP7BldgSchedCov>(_builder).fromPeriod(period) as productmodel.BP7LossPayable
  }
  
}