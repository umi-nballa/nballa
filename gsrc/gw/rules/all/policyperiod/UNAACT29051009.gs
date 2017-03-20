
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
class UNAACT29051009 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //If renewal review for agent codes (agency number) 89070, 89076, and hits an underwriting issue

    var pcodes = {"89070", "89076"}
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("geico_review_and_approve_renewal")
    if (period.Job.Subtype==typekey.Job.TC_RENEWAL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
        && pcodes.containsIgnoreCase(period.ProducerCodeOfRecord.Code.substring(0,5)))
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
      activity.assignActivityToQueue(Group.finder.findByPublicId("GEICO").AssignableQueues.first(),
          Group.finder.findByPublicId("GEICO"))

    }
   return RuleEvaluationResult.skip()
  }

}

