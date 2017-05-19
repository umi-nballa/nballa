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
class DocPriorLossRun implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {


   if (!period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_FL  ){
             if (period.Policy.PriorPolicies.Count > 0 && period.Policy.PriorPolicies.hasMatch( \ elt1 ->  elt1.CarrierType == typekey.CarrierType_Ext.TC_NOPRIORINS))  {
               return RuleEvaluationResult.execute()
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

    override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_prior_loss_runs_required")
      var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
      ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, activity)
      var list = new AgentDocList_Ext(target)
      list.DocumentName = "Prior Loss Runs"
      target.addToAgentDocs(list)
    }
}

