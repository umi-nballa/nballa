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
class DocCPPWindMit implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

   if (period.CPLineExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_FL  ){
             if (period.CPLine?.CPLocations.hasMatch( \ elt1 ->  elt1.Buildings.hasMatch( \ elt2 -> elt2.windmiti5)) )  {
               return RuleEvaluationResult.execute()
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

    override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("CRP_current_wind_mitigation")
      var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
      ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW, ActivityUtil.ACTIVITY_QUEUE.CL_UW, activity)
      var list = new AgentDocList_Ext(target)
      list.DocumentName = "Wind Mitigation Forms"
      target.addToAgentDocs(list)
    }
}

