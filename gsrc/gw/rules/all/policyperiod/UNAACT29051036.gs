
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
class UNAACT29051036 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //If (Product = BOP or CPP) and Transaction = Submission and UW Request selected due to uw issues
    // (Note: replaces the review and approve uw activity)

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_review_new_bus_app")
    if (!period.HomeownersLine_HOEExists && period.Job.Subtype==typekey.Job.TC_SUBMISSION && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED)
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
      var queue:AssignableQueue = AssignableQueue.finder.findVisibleQueuesForUser(User.util.CurrentUser).firstWhere( \ elt -> elt.DisplayName=="CL UW Queue") as AssignableQueue
      activity.assignToQueue(queue)//)assignActivityToQueue(Group.finder.findByPublicId("CL UW Queue").AssignableQueues.first(),Group.finder.findByPublicId("CL UW Queue"))



    }
   return RuleEvaluationResult.skip()
  }

}

