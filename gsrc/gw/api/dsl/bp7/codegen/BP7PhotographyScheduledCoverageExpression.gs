package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7PhotographyScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LineSchedCovItemBuilder>(BP7LineSchedCov))
    _builder.withPatternCode("BP7Photography")
  }
  
  function withScheduledItems(scheduledItems : Boolean) : BP7PhotographyScheduledCoverageExpression {
    _builder.withGenericTermValue("BP7ScheduledItems", scheduledItems)
    syncAvailability("BP7ScheduledItems")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineSchedCov>() {
      override function execute(clause : BP7LineSchedCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function with(scheduleItem : BP7PhotographyScheduledItemExpression) : BP7PhotographyScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7PhotographyScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7Photography {
    return new EntityRetriever<BP7LineSchedCov>(_builder).fromPeriod(period) as productmodel.BP7Photography
  }
  
}