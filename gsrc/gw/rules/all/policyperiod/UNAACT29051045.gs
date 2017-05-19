package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.ActivityUtil
uses gw.accelerator.ruleeng.IRuleAction

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAACT29051045 implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If (Product = BOP or CPP) and Transaction = Renewal and UW Request selected due to uw issues
// (Note: replaces review and approval uw activity)
   var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_review_renewal")
    if (!period.HomeownersLine_HOEExists && period.Job.Subtype==typekey.Job.TC_RENEWAL &&
        period.Status == typekey.PolicyPeriodStatus.TC_QUOTED &&  !period.UWIssuesActiveOnly.IsEmpty)
    {
      return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }


  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_review_renewal")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW.QueueName, ActivityUtil.ACTIVITY_QUEUE.CL_UW.QueueName, activity)
  }
}

