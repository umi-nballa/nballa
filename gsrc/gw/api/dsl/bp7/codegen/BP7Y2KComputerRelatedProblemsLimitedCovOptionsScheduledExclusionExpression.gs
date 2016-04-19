package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledExclusionExpression extends DataBuilderExpression<BP7ScheduledExclusionBuilder> {

  
  construct() {
    super(new BP7ScheduledExclusionBuilder<BP7LineSchedExclItemBuilder>(BP7LineSchedExcl))
    _builder.withPatternCode("BP7Y2KComputerRelatedProblemsLimitedCovOptions")
  }
  
  function withManualPremium(manualPremium : java.math.BigDecimal) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledExclusionExpression {
    _builder.withDirectTerm("BP7ManualPremium5", manualPremium)
    syncAvailability("BP7ManualPremium5")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineSchedExcl>() {
      override function execute(clause : BP7LineSchedExcl) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function with(scheduleItem : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledItemExpression) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledExclusionExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7Y2KComputerRelatedProblemsLimitedCovOptionsScheduledExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7Y2KComputerRelatedProblemsLimitedCovOptions {
    return new EntityRetriever<BP7LineSchedExcl>(_builder).fromPeriod(period) as productmodel.BP7Y2KComputerRelatedProblemsLimitedCovOptions
  }
  
}