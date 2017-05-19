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
class UNAACT29051016 implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
   //If risk and large loss report received from Claims Center

    if ((period.HomeownersLine_HOEExists && period.HomeownersLine_HOE.HOPriorLosses_Ext!=null && period.HomeownersLine_HOE.HOPriorLosses_Ext.length>0
    && period.HomeownersLine_HOE.HOPriorLosses_Ext.firstWhere( \ elt -> elt.ClaimPayment.firstWhere( \ elt1 -> elt1.ClaimType==typekey.ClaimType_Ext.TC_RISK )!=null)!=null)
       )
    {
      return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("review_risk_and_large_loss_reports")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.SENIOR_UW, ActivityUtil.ACTIVITY_QUEUE.SENIOR_UW, activity)
  }
}

