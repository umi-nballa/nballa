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
class UNAACT29051017 implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {


    //If endorsement request received for agent codes other than 3668, 28500, 28000, 28300, 28301, 28400, 90194, 29000, 89070,
    // 89076

    var pcodes = {"3668", "28500", "28000", "28300", "28301", "28400", "90194", "29000", "89070", "89076"}
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("review_and_approve_uw_endorsement")
    if (period.Job.Subtype==typekey.Job.TC_POLICYCHANGE && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
        && !pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
      return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("review_and_approve_uw_endorsement")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue("Endorsements", "Universal Insurance Manager's Inc", activity)
  }
}

