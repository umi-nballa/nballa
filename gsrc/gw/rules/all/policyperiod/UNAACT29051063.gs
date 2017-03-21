
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
class UNAACT29051063 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If Current term within 75 days of expiration create activity and include in Renewal Workplan



    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("validate_multipolicy_discount")
    if (period.HomeownersLine_HOEExists)
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
    //  var queueho:AssignableQueue = AssignableQueue.finder.findVisibleQueuesForUser(User.util.CurrentUser).firstWhere( \ elt -> elt.DisplayName=="CSR Queue") as AssignableQueue

     // activity.assignToQueue(queueho)//)assignActivityToQueue(Group.finder.findByPublicId("CL UW Queue").AssignableQueues.first(),Group.finder.findByPublicId("CL UW Queue"))




    }
   return RuleEvaluationResult.skip()
  }

}

