
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
class UNAACT29051061 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If Reinstatement job and Risk Indicator = Yes, then do not complete reinstatement job (uw issue)
// and create Reinstatement Pending Risk Indicator Activity and assign to the UW Queue when
// Product = HO or CL UW Queue when Product = BOP or CPP

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("pending_reinstatement_risk_indicator")
    if (period.RiskIndicator_Ext &&  period.Job.Subtype==typekey.Job.TC_REINSTATEMENT && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
       )
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
      var queueho:AssignableQueue = AssignableQueue.finder.findVisibleQueuesForUser(User.util.CurrentUser).firstWhere( \ elt -> elt.DisplayName=="UW Queue") as AssignableQueue
      var queuecl:AssignableQueue = AssignableQueue.finder.findVisibleQueuesForUser(User.util.CurrentUser).firstWhere( \ elt -> elt.DisplayName=="CL UW Queue") as AssignableQueue

      if(period.HomeownersLine_HOEExists)
      activity.assignToQueue(queueho)//)assignActivityToQueue(Group.finder.findByPublicId("CL UW Queue").AssignableQueues.first(),Group.finder.findByPublicId("CL UW Queue"))
      else
      activity.assignToQueue(queuecl)



    }
   return RuleEvaluationResult.skip()
  }

}

