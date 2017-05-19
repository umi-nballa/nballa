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
class DocSPP implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var TotalCovAmount = 0
    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
              for ( item in period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE?.ScheduledItems){
                TotalCovAmount += item.ExposureValue
              }
             if (period.BaseState.Code == typekey.State.TC_AZ)  {
             if (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOEExists &&
                (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ExposureValue > 2000).Count > 0  ||
                  TotalCovAmount > 5000  ))  {
               return RuleEvaluationResult.execute()
             }
             }else {
               if (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOEExists &&
                   (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ExposureValue > 5000 || elt.ExposureValue < 9999).Count > 0  ||
                       TotalCovAmount > 5000  ))  {
                 return RuleEvaluationResult.execute()

                 }
               }
    }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("appraisal_for_spp_followup")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP, activity)

    var list = new AgentDocList_Ext(target)
    list.DocumentName = "Appraisal(s) for Scheduled Personal Property"
    target.addToAgentDocs(list)
  }
}

