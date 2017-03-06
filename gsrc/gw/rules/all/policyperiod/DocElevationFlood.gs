
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
class DocElevationFlood implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("flood_elevation_follow_up")

    if (period.HomeownersLine_HOEExists){
          if(period.BaseState.Code == typekey.State.TC_FL ){
             if (period.HomeownersLine_HOE?.Dwelling.AbveBlwBaseFldElvtn_Ext != null &&
             typekey.AbveBlwBaseFldElvtn_Ext.TF_DOCLISTFILTER.TypeKeys.contains(period.HomeownersLine_HOE?.Dwelling.AbveBlwBaseFldElvtn_Ext))  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Elevation Certificate (Flood)"
               period.addToAgentDocs(list)
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

