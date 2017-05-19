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
class DocBOPCPPWindHail implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(isEligible(period))
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


   override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
     var activityPattern = ActivityPattern.finder.getActivityPatternByCode("wind_hurricane_hail_rej_followup")
     var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
     ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, activity)

     var list = new AgentDocList_Ext(target)
     list.DocumentName = "Wind or Hail Rejection"
     target.addToAgentDocs(list)
   }

  function isEligible(period : PolicyPeriod):boolean{

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
        return true
      }
      else if (period.CPLineExists && windpoolCPP == "No" && period.CPLine.ExclusionsFromCoverable?.hasMatch( \ elt -> elt.PatternCode == "CPWindorHailExclusion_EXT")){
        return true
      }
    }
    return false
  }
}


