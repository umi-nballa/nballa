package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocElevationFlood implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_FL ){
             if (period.HomeownersLine_HOE?.Dwelling.AbveBlwBaseFldElvtn_Ext != null &&
             typekey.AbveBlwBaseFldElvtn_Ext.TF_DOCLISTFILTER.TypeKeys.contains(period.HomeownersLine_HOE?.Dwelling.AbveBlwBaseFldElvtn_Ext))  {
               return RuleEvaluationResult.execute()
             }
            }
      }
   return RuleEvaluationResult.skip()
  }
  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("flood_elevation_follow_up")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, activity)

    var list = new AgentDocList_Ext(target)
    list.DocumentName =  "Elevation Certificate (Flood)"
    target.addToAgentDocs(list)
  }
}

