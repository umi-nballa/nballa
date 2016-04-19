package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7DesignatedPremisesProjectScheduledConditionExpression extends DataBuilderExpression<BP7ScheduledPolicyConditionBuilder> {

  
  construct() {
    super(new BP7ScheduledPolicyConditionBuilder<BP7LocSchedCondItemBuilder>(BP7LocSchedCond))
    _builder.withPatternCode("BP7DesignatedPremisesProject")
  }
  
  function with(scheduleItem : BP7DesignatedPremisesProjectScheduledItemExpression) : BP7DesignatedPremisesProjectScheduledConditionExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7DesignatedPremisesProjectScheduledConditionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7DesignatedPremisesProject {
    return new EntityRetriever<BP7LocSchedCond>(_builder).fromPeriod(period) as productmodel.BP7DesignatedPremisesProject
  }
  
}