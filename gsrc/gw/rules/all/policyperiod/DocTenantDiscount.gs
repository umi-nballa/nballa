
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
class DocTenantDiscount implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("insured_tenant_discount_follow_up_nc")
    var list = new AgentDocList_Ext(period)
    list.DocumentName = "Insured Tenant Discount"
    if (period.HomeownersLine_HOEExists){
          if(period.BaseState.Code == typekey.State.TC_NC ){
             if (period.HomeownersLine_HOE?.Dwelling.InsuredTenantDiscount_Ext)  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               period.addToAgentDocs(list)
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

