
package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocWindMit implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("wind_mit_follow_up")
   if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_FL || period.BaseState.Code == typekey.State.TC_SC ){
             if (period.HomeownersLine_HOE?.Dwelling.WindMitigation_Ext)  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Wind Mitigation Form"
               period.addToAgentDocs(list)
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

