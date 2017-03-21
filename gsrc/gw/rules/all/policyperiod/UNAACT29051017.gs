
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
class UNAACT29051017 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {


    //If endorsement request received for agent codes other than 3668, 28500, 28000, 28300, 28301, 28400, 90194, 29000, 89070,
    // 89076



    var pcodes = {"3668", "28500", "28000", "28300", "28301", "28400", "90194", "29000", "89070", "89076"}
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("review_and_approve_uw_endorsement")
    if (period.Job.Subtype==typekey.Job.TC_POLICYCHANGE && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
        && !pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
   //   activity.assignActivityToQueue(Group.finder.findByPublicId("Endorsements").AssignableQueues.first(),
      //       Group.finder.findByPublicId("Endorsements"))

    }
   return RuleEvaluationResult.skip()
  }

}

