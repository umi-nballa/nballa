
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
class DocBOPAlarmCertificate implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOP_alarm_certificate_required")

    if (period.BP7LineExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_FL ){
                      for ( loc in period.BP7Line.BP7Locations)
                        {
                          if (loc.Buildings.hasMatch( \ elt1 -> elt1.PropertyType == typekey.BP7PropertyType.TC_RETAIL
                              || elt1.PropertyType == typekey.BP7PropertyType.TC_DISTRIBUTOR )&&
                                  period.BP7Line.BP7Locations.Buildings.Classifications.Coverages.hasMatch( \ elt1 -> elt1.PatternCode == "BP7TheftLimitations")){
                            var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                            var list = new AgentDocList_Ext(period)
                            list.DocumentName = "Alarm Certificate or Billing Statement"
                            period.addToAgentDocs(list)
                            return RuleEvaluationResult.skip()
                          }
                        }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

