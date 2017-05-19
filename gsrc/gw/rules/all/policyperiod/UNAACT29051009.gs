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
class UNAACT29051009 implements IRuleCondition<PolicyPeriod> ,IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //If renewal review for agent codes (agency number) 89070, 89076, and hits an underwriting issue

    var pcodes = {"89070", "89076"}

    if (period.Job.Subtype==typekey.Job.TC_RENEWAL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED  &&  !period.UWIssuesActiveOnly.IsEmpty
        && pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
      return RuleEvaluationResult.execute()

    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("geico_review_and_approve_renewal")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.GEICO, ActivityUtil.ACTIVITY_QUEUE.GEICO, activity)
  }
}

