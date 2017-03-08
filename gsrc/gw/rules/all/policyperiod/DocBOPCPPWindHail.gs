
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
class DocBOPCPPWindHail implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("wind_hurricane_hail_rej_followup")
    var windpoolBOP = "Yes"
    var windpoolCPP = "Yes"

    for (loc in period.BP7Line.BP7Locations){
      for(building in loc.Buildings){
        var windpool =  building.OverrideWindPool_Ext ? building.OverrideWindPool_Ext : building.WindPool_Ext
        if (windpool == "No"){
          windpoolBOP = windpool
        }
      }
    }

    for (loc in period.CPLine.CPLocations){
      for(building in loc.Buildings){
        var windpool =  building.OverrideWindPool_Ext ? building.OverrideWindPool_Ext : building.Windpoolvalue_Ext
        if (windpool == "No"){
          windpoolCPP = windpool
        }
      }
    }

      if(period.BaseState.Code == typekey.State.TC_FL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
                if (period.BP7LineExists && windpoolBOP == "No" && period.BP7Line.ExclusionsFromCoverable?.hasMatch( \ elt -> elt.PatternCode == "BP7WindstormOrHailExcl_EXT")){
                            var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                           var list = new AgentDocList_Ext(period)
                           list.DocumentName = "Wind or Hail Rejection"
                           period.addToAgentDocs(list)
                     }
                else if (period.CPLineExists && windpoolCPP == "No" && period.CPLine.ExclusionsFromCoverable?.hasMatch( \ elt -> elt.PatternCode == "CPWindorHailExclusion_EXT")){
                       var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                      var list = new AgentDocList_Ext(period)
                      list.DocumentName = "Wind or Hail Rejection"
                      period.addToAgentDocs(list)
                    }
      }
   return RuleEvaluationResult.skip()
  }

}


