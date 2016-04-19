package gw.api.dsl.bp7.codegen

uses gw.api.builder.PolicyConditionBuilder
uses gw.entity.IEntityType
uses gw.api.databuilder.DataBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ScheduledPolicyConditionBuilder<B extends DataBuilder> extends PolicyConditionBuilder {

  
  construct(type : IEntityType) {
    super(type)
  }
  
  function withScheduledItem(prop : String, scheduleItem : B) : BP7ScheduledPolicyConditionBuilder {
    addArrayElement(getValueType().TypeInfo.getProperty(prop), scheduleItem)
    return this
  }
  
}