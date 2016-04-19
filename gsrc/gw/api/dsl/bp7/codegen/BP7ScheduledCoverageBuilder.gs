package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.entity.IEntityType
uses gw.api.databuilder.DataBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ScheduledCoverageBuilder<B extends DataBuilder> extends CoverageBuilder {

  
  construct(type : IEntityType) {
    super(type)
  }
  
  function withScheduledItem(prop : String, scheduleItem : B) : BP7ScheduledCoverageBuilder {
    addArrayElement(getValueType().TypeInfo.getProperty(prop), scheduleItem)
    return this
  }
  
}