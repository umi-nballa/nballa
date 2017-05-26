package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction
uses una.utils.ActivityUtil
uses una.utils.ActivityUtil.ACTIVITY_QUEUE

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAACT29051036 implements IRuleCondition<PolicyPeriod>  , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //If (Product = BOP or CPP) and Transaction = Submission and UW Request selected due to uw issues
    // (Note: replaces the review and approve uw activity)

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_review_new_bus_app")
    if (!period.HomeownersLine_HOEExists && period.Job.Subtype==typekey.Job.TC_SUBMISSION && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED)
    {
      return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_review_new_bus_app")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ACTIVITY_QUEUE.CL_UW.QueueName, ACTIVITY_QUEUE.CL_UW.QueueName, activity)
  }
}

