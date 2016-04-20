package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7AddlInsdLessorsLeasedEquipmtScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LocSchedCovItemBuilder>(BP7LocSchedCov))
    _builder.withPatternCode("BP7AddlInsdLessorsLeasedEquipmt")
  }
  
  function with(scheduleItem : BP7AddlInsdLessorsLeasedEquipmtScheduledItemExpression) : BP7AddlInsdLessorsLeasedEquipmtScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7AddlInsdLessorsLeasedEquipmtScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7AddlInsdLessorsLeasedEquipmt {
    return new EntityRetriever<BP7LocSchedCov>(_builder).fromPeriod(period) as productmodel.BP7AddlInsdLessorsLeasedEquipmt
  }
  
}