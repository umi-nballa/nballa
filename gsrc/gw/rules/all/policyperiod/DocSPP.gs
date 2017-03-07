
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
class DocSPP implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("appraisal_for_spp_followup")

    var TotalCovAmount = 0
    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
              for ( item in period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE?.ScheduledItems){
                TotalCovAmount += item.ExposureValue
              }
             if (period.BaseState.Code == typekey.State.TC_AZ)  {
             if (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOEExists &&
                (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ExposureValue > 2000).Count > 0  ||
                  TotalCovAmount > 5000  ))  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Appraisal(s) for Scheduled Personal Property"
               period.addToAgentDocs(list)
             }
             }else {
               if (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOEExists &&
                   (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ExposureValue > 5000 || elt.ExposureValue < 9999).Count > 0  ||
                       TotalCovAmount > 5000  ))  {
                 var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                 var list = new AgentDocList_Ext(period)
                 list.DocumentName = "Appraisal(s) for Scheduled Personal Property"
                 period.addToAgentDocs(list)
                 }
               }
    }
   return RuleEvaluationResult.skip()
  }

}

