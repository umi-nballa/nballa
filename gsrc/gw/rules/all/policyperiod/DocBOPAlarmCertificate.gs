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
class DocBOPAlarmCertificate implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if (period.BP7LineExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_FL ){
                      for ( loc in period.BP7Line.BP7Locations)
                        {
                          if (loc.Buildings.hasMatch( \ elt1 -> elt1.PropertyType == typekey.BP7PropertyType.TC_RETAIL
                              || elt1.PropertyType == typekey.BP7PropertyType.TC_DISTRIBUTOR )&&
                                  period.BP7Line.BP7Locations.Buildings.Classifications.Coverages.hasMatch( \ elt1 -> elt1.PatternCode == "BP7TheftLimitations")){
                            return RuleEvaluationResult.execute()
                          }
                        }
            }
      }
   return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOP_alarm_certificate_required")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP, ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP, activity)

    var list = new AgentDocList_Ext(target)
    list.DocumentName = "Alarm Certificate or Billing Statement"
    target.addToAgentDocs(list)
  }


}

