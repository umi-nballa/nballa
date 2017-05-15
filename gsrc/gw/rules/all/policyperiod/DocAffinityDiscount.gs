package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.ActivityUtil
uses gw.accelerator.ruleeng.IRuleAction

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocAffinityDiscount implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_TX ){
             if (period.PreferredEmpGroup_Ext != null)  {
                 return  RuleEvaluationResult.execute()
             }
            }
      }
   return RuleEvaluationResult.skip()
  }


  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    //Create Activity
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("affinity_discount_follow_up")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, activity)

    // add the document to the list on period
    var list = new AgentDocList_Ext(target)
    list.DocumentName = "Affinity Discount"
    target.addToAgentDocs(list)
  }
}

