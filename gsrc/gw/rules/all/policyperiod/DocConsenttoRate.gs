
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
class DocConsenttoRate implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("consent_to_rate_follow_up")

    if (period.HomeownersLine_HOEExists){
          if(period.BaseState.Code == typekey.State.TC_NC){
             if (period.ConsentToRate_Ext && period.ConsentToRateReceived_Ext)  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Consent to Rate"
               period.addToAgentDocs(list)
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

