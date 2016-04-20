package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LineSchedCovItemBuilder>(BP7LineSchedCov))
    _builder.withPatternCode("BP7RestaurantsLossOrDamageToCustomersAutosLegalLia")
  }
  
  function withOtherThanCollisionEachAutoDeductible(otherThanCollisionEachAutoDeductible : productmodel.OptionBP7OTCEachAutoDed1TypeValue) : BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7OTCEachAutoDed1", otherThanCollisionEachAutoDeductible.Description)
    syncAvailability("BP7OTCEachAutoDed1")
    return this
  }
  
  function withOtherThanCollisionAnyOneEventDeductible(otherThanCollisionAnyOneEventDeductible : productmodel.OptionBP7OTCAnyOneEventDed1TypeValue) : BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7OTCAnyOneEventDed1", otherThanCollisionAnyOneEventDeductible.Description)
    syncAvailability("BP7OTCAnyOneEventDed1")
    return this
  }
  
  function withCollisionDeductible(collisionDeductible : productmodel.OptionBP7CollisionDed1TypeValue) : BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7CollisionDed1", collisionDeductible.Description)
    syncAvailability("BP7CollisionDed1")
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
  
  function with(scheduleItem : BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledItemExpression) : BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia {
    return new EntityRetriever<BP7LineSchedCov>(_builder).fromPeriod(period) as productmodel.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia
  }
  
}