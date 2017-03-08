
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
class DocBOPCPPTerrorism implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_terrorism_rejection_required")
      if(period.BaseState.Code == typekey.State.TC_FL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
                if (period.BP7LineExists && period.BP7Line.ExclusionsFromCoverable?.hasMatch( \ elt -> elt.PatternCode == "BP7ExclCertfdActsTerrsmCovFireLosses")){
                            var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                           var list = new AgentDocList_Ext(period)
                           list.DocumentName = "Terrorism Rejection"
                           period.addToAgentDocs(list)
                     }
                else if (period.CPLineExists && period.CPLine.TerrorismCoverage){
                       var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                      var list = new AgentDocList_Ext(period)
                      list.DocumentName = "Terrorism Rejection"
                      period.addToAgentDocs(list)
                    }
      }
   return RuleEvaluationResult.skip()
  }

}

