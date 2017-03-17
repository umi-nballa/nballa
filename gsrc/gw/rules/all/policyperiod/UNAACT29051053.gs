
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
class UNAACT29051053 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//Intregration with Billing Center - Renewal Downpayment has NOT been received;
// same as the intent to cancel notification from BC to PC

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_renewal_payment_not_received")
    if (!period.HomeownersLine_HOEExists && period.Job.Subtype==typekey.Job.TC_SUBMISSION && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
        )
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
      var queue:AssignableQueue = AssignableQueue.finder.findVisibleQueuesForUser(User.util.CurrentUser).firstWhere( \ elt -> elt.DisplayName=="CL UW Queue") as AssignableQueue
      activity.assignToQueue(queue)//)assignActivityToQueue(Group.finder.findByPublicId("CL UW Queue").AssignableQueues.first(),Group.finder.findByPublicId("CL UW Queue"))



    }
   return RuleEvaluationResult.skip()
  }

}

