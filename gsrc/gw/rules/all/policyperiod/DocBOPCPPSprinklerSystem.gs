
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
class DocBOPCPPSprinklerSystem implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_sprinkler_insp_required")
      if(period.BaseState.Code == typekey.State.TC_FL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
                if (period.BP7LineExists){
                  for ( loc in period.BP7Line.BP7Locations)
                  {
                    if (loc.Buildings?.where( \ elt -> elt.Sprinklered).Count > 0){
                        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                           var list = new AgentDocList_Ext(period)
                           list.DocumentName = "Sprinkler Inspection"
                           period.addToAgentDocs(list)

                      }
                } }
                else if (period.CPLineExists){
                  for(loc in period.CPLine.CPLocations)     {
                    if(loc.Buildings?.where( \ elt -> elt.AutomaticFireSuppress).Count > 0) {
                      var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                      var list = new AgentDocList_Ext(period)
                      list.DocumentName = "Sprinkler Inspection"
                      period.addToAgentDocs(list)
                    }
                  }
                }
     }
   return RuleEvaluationResult.skip()
  }

}

