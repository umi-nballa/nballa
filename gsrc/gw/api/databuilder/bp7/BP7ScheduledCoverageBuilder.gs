package gw.api.databuilder.bp7

uses gw.api.builder.CoverageBuilder
uses gw.entity.IEntityType
uses gw.api.databuilder.DataBuilder

class BP7ScheduledCoverageBuilder<B extends DataBuilder> extends CoverageBuilder {

  construct(type : IEntityType) {
    super(type)
  }

  function withScheduledItem(prop : String, scheduleItem : B) : BP7ScheduledCoverageBuilder {
    addArrayElement(getValueType().TypeInfo.getProperty(prop), scheduleItem)
    return this
  }
  
}
