
package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 *
 * TLV 4/17/17 - fixed as part of CR102.  Original implementation did not work.
 */
class UNAACT29051063 implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    var result : RuleEvaluationResult

    if (shouldCreateMultiLineValidationActivity(period)){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

   return result
  }

  private function shouldCreateMultiLineValidationActivity(period: PolicyPeriod): boolean {
    return period.HomeownersLine_HOEExists
       and period.Renewal != null
       and period.HomeownersLine_HOE.MultiPolicyDiscount_Ext
       and java.util.Date.CurrentDate.addDays(75).afterOrEqualsIgnoreTime(period.EditEffectiveDate)
       and !period.Job.AllOpenActivities.hasMatch(\activity -> activity.ActivityPattern.Code == "validate_multipolicy_discount")
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult) {
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("validate_multipolicy_discount")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR.QueueName, activity)
  }
}

