
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
class DocCPPWindMit implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("wind_mit_follow_up")
   if (period.CPLineExists){
          if(period.BaseState.Code == typekey.State.TC_FL  ){
             if (period.CPLine?.CPLocations.hasMatch( \ elt1 ->  elt1.Buildings.hasMatch( \ elt2 -> elt2.windmiti5)) )  {
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

