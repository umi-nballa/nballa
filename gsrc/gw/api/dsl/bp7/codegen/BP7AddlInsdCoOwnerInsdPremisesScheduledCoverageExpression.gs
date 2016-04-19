package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7AddlInsdCoOwnerInsdPremisesScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LocSchedCovItemBuilder>(BP7LocSchedCov))
    _builder.withPatternCode("BP7AddlInsdCoOwnerInsdPremises")
  }
  
  function with(scheduleItem : BP7AddlInsdCoOwnerInsdPremisesScheduledItemExpression) : BP7AddlInsdCoOwnerInsdPremisesScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7AddlInsdCoOwnerInsdPremisesScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7AddlInsdCoOwnerInsdPremises {
    return new EntityRetriever<BP7LocSchedCov>(_builder).fromPeriod(period) as productmodel.BP7AddlInsdCoOwnerInsdPremises
  }
  
}