package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocAffinityDiscount extends DocumentRequestRuleExecution implements IRuleCondition<PolicyPeriod> {
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
 //Create Activity
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("affinity_discount_follow_up")
//  var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return period.HomeownersLine_HOEExists
       and period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
       and period.PreferredEmpGroup_Ext != null
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_AffinityDiscount
  }
}

