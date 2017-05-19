package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAACT29051019 implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {


    //If new business submission for agent codes other than 3668, 28500, 28000, 28300, 28301, 28400, 90194, 29000, 89070, 89076,
    // and hits an underwriting activity(s)  issue



    var pcodes = {"3668", "28500", "28000", "28300", "28301", "28400", "90194", "29000", "89070", "89076"}

    if (period.Job.Subtype==typekey.Job.TC_SUBMISSION && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED   &&  !period.UWIssuesActiveOnly.IsEmpty
        && !pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
        return RuleEvaluationResult.execute()

    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("review_and_approve_bound_referral")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW.QueueName, ActivityUtil.ACTIVITY_QUEUE.CL_UW.QueueName, activity)
  }
}

