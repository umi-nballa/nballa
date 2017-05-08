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
class UNAACT29051005 implements IRuleCondition<PolicyPeriod> ,IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {


    //If renewal review for agent codes (agency number) 3668, 28500, 28000, 28300, 28301, 28400, 90194, 29000,
    // and hits an underwriting issue


    var pcodes = {"3668", "28500", "28000", "28300", "28301", "28400", "90194", "29000"}

    if (period.Job.Subtype==typekey.Job.TC_RENEWAL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED  &&  !period.UWIssuesActiveOnly.IsEmpty
        && pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
      return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("builder_review_and_approve_renewal")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue("Builder Accounts", "Universal Insurance Manager's Inc", activity)
  }
}

