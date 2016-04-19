package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7AddlInsdOwnersLesseesOrContrctrsCompldOpsScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LineSchedCovItemBuilder>(BP7LineSchedCov))
    _builder.withPatternCode("BP7AddlInsdOwnersLesseesOrContrctrsCompldOps")
  }
  
  function withManualPremium(manualPremium : java.math.BigDecimal) : BP7AddlInsdOwnersLesseesOrContrctrsCompldOpsScheduledCoverageExpression {
    _builder.withDirectTerm("BP7ManualPremium10", manualPremium)
    syncAvailability("BP7ManualPremium10")
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
  
  function with(scheduleItem : BP7AddlInsdOwnersLesseesOrContrctrsCompldOpsScheduledItemExpression) : BP7AddlInsdOwnersLesseesOrContrctrsCompldOpsScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7AddlInsdOwnersLesseesOrContrctrsCompldOpsScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7AddlInsdOwnersLesseesOrContrctrsCompldOps {
    return new EntityRetriever<BP7LineSchedCov>(_builder).fromPeriod(period) as productmodel.BP7AddlInsdOwnersLesseesOrContrctrsCompldOps
  }
  
}