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
class DocBOPCPPTerrorism implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

   if(period.BaseState.Code == typekey.State.TC_FL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
                if (period.BP7LineExists && period.BP7Line.ExclusionsFromCoverable?.hasMatch( \ elt -> elt.PatternCode == "BP7ExclCertfdActsTerrsmCovFireLosses")){
                  return RuleEvaluationResult.execute()
                     }
                else if (period.CPLineExists && period.CPLine.TerrorismCoverage){
                  return RuleEvaluationResult.execute()
                    }
      }
   return RuleEvaluationResult.skip()
  }

   override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
     var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_terrorism_rejection_required")
     var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
     ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP, ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP, activity)
     var list = new AgentDocList_Ext(target)
     list.DocumentName = "Terrorism Rejection"
     target.addToAgentDocs(list)
   }

}

