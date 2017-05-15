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
class DocTenantDiscount implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

  if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_NC ){
             if (period.HomeownersLine_HOE?.Dwelling.InsuredTenantDiscount_Ext)  {

               return RuleEvaluationResult.execute()
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("insured_tenant_discount_follow_up_nc")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, activity)

    var list = new AgentDocList_Ext(target)
    list.DocumentName =  "Insured Tenant Discount"
    target.addToAgentDocs(list)
  }
}

