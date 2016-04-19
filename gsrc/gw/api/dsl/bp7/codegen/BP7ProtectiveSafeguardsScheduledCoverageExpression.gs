package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ProtectiveSafeguardsScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7BldgSchedCovItemBuilder>(BP7BldgSchedCov))
    _builder.withPatternCode("BP7ProtectiveSafeguards")
  }
  
  function with(scheduleItem : BP7ProtectiveSafeguardsScheduledItemExpression) : BP7ProtectiveSafeguardsScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7ProtectiveSafeguardsScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ProtectiveSafeguards {
    return new EntityRetriever<BP7BldgSchedCov>(_builder).fromPeriod(period) as productmodel.BP7ProtectiveSafeguards
  }
  
}