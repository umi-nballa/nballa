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
class UNAACT29051003 implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//(renewal review):  If renewal review for agent codes other than 3668, 28500, 28000, 28300, 28301, 28400, 90194, 29000, 89070, 89076,
// and hits an underwriting activity(s)  
    var pcodes = {"3668", "28500", "28000", "28300", "28301", "28400", "90194", "29000", "89070", "89076"}
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("approve_submission")
    if (period.Job.Subtype==typekey.Job.TC_RENEWAL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED  &&  !period.UWIssuesActiveOnly.IsEmpty
        && pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
      return RuleEvaluationResult.execute()

    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("approve_submission")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.NEW_BUSINESS, ActivityUtil.ACTIVITY_QUEUE.NEW_BUSINESS, activity)
  }
}

