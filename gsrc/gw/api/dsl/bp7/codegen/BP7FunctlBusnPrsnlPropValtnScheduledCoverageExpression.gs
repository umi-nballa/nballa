package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7FunctlBusnPrsnlPropValtnScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7ClassSchedCovItemBuilder>(BP7ClassSchedCov))
    _builder.withPatternCode("BP7FunctlBusnPrsnlPropValtn")
  }
  
  function with(scheduleItem : BP7FunctlBusnPrsnlPropValtnScheduledItemExpression) : BP7FunctlBusnPrsnlPropValtnScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7FunctlBusnPrsnlPropValtnScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7FunctlBusnPrsnlPropValtn {
    return new EntityRetriever<BP7ClassSchedCov>(_builder).fromPeriod(period) as productmodel.BP7FunctlBusnPrsnlPropValtn
  }
  
}