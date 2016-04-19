package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedBScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LineSchedCovItemBuilder>(BP7LineSchedCov))
    _builder.withPatternCode("BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedB")
  }
  
  function with(scheduleItem : BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedBScheduledItemExpression) : BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedBScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedBScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedB {
    return new EntityRetriever<BP7LineSchedCov>(_builder).fromPeriod(period) as productmodel.BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedB
  }
  
}