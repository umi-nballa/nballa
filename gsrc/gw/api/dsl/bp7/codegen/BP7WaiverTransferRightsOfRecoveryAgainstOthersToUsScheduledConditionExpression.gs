package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledConditionExpression extends DataBuilderExpression<BP7ScheduledPolicyConditionBuilder> {

  
  construct() {
    super(new BP7ScheduledPolicyConditionBuilder<BP7LineSchedCondItemBuilder>(BP7LineSchedCond))
    _builder.withPatternCode("BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs")
  }
  
  function with(scheduleItem : BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledItemExpression) : BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledConditionExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsScheduledConditionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs {
    return new EntityRetriever<BP7LineSchedCond>(_builder).fromPeriod(period) as productmodel.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs
  }
  
}