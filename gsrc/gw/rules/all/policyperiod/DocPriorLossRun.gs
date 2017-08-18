package gw.rules.all.policyperiod

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocPriorLossRun extends DocumentRequestRuleExecution{
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_prior_loss_runs_required")
//  var activity = activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return (period.BP7LineExists or period.CPLineExists)
       and period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
       and period.Policy.PriorPolicies?.hasMatch( \ elt1 ->  elt1.CarrierType == typekey.CarrierType_Ext.TC_NOPRIORINS)
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_CLPriorLossRuns
  }
}

