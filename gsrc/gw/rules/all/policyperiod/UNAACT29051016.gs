
package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAACT29051016 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
   //If risk and large loss report received from Claims Center

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("review_risk_and_large_loss_reports")
    if ((period.HomeownersLine_HOEExists && period.HomeownersLine_HOE.HOPriorLosses_Ext!=null && period.HomeownersLine_HOE.HOPriorLosses_Ext.length>0
    && period.HomeownersLine_HOE.HOPriorLosses_Ext.firstWhere( \ elt -> elt.ClaimPayment.firstWhere( \ elt1 -> elt1.ClaimType==typekey.ClaimType_Ext.TC_RISK )!=null)!=null)
       )
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
  //    activity.assignActivityToQueue(Group.finder.findByPublicId("Senior UW Queue").AssignableQueues.first(),
   //       Group.finder.findByPublicId("Senior UW Queue"))

    }
   return RuleEvaluationResult.skip()
  }

}

