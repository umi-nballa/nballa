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
class UNAACT29051061 implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

   if (period.RiskIndicator_Ext and  period.Job.Subtype==typekey.Job.TC_REINSTATEMENT)
    {
      return RuleEvaluationResult.execute()

    }
   return RuleEvaluationResult.skip()
  }
  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("pending_reinstatement_risk_indicator")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    if(target.HomeownersLine_HOEExists)
      ActivityUtil.assignActivityToQueue("UW Queue", "Universal Insurance Manager's Inc", activity)
    else
      ActivityUtil.assignActivityToQueue("CL UW Queue", "Universal Insurance Manager's Inc", activity)
  }
}

