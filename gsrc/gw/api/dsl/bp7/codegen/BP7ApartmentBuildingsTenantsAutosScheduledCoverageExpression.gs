package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ApartmentBuildingsTenantsAutosScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LineSchedCovItemBuilder>(BP7LineSchedCov))
    _builder.withPatternCode("BP7ApartmentBuildingsTenantsAutos")
  }
  
  function withOtherThanCollisionEachAutoDeductible(otherThanCollisionEachAutoDeductible : productmodel.OptionBP7OTCEachAutoDedTypeValue) : BP7ApartmentBuildingsTenantsAutosScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7OTCEachAutoDed", otherThanCollisionEachAutoDeductible.Description)
    syncAvailability("BP7OTCEachAutoDed")
    return this
  }
  
  function withOtherThanCollisionAnyOneEventDeductible(otherThanCollisionAnyOneEventDeductible : productmodel.OptionBP7OTCAnyOneEventDedTypeValue) : BP7ApartmentBuildingsTenantsAutosScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7OTCAnyOneEventDed", otherThanCollisionAnyOneEventDeductible.Description)
    syncAvailability("BP7OTCAnyOneEventDed")
    return this
  }
  
  function withCollisionDeductible(collisionDeductible : productmodel.OptionBP7CollisionDedTypeValue) : BP7ApartmentBuildingsTenantsAutosScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7CollisionDed", collisionDeductible.Description)
    syncAvailability("BP7CollisionDed")
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
  
  function with(scheduleItem : BP7ApartmentBuildingsTenantsAutosScheduledItemExpression) : BP7ApartmentBuildingsTenantsAutosScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7ApartmentBuildingsTenantsAutosScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ApartmentBuildingsTenantsAutos {
    return new EntityRetriever<BP7LineSchedCov>(_builder).fromPeriod(period) as productmodel.BP7ApartmentBuildingsTenantsAutos
  }
  
}