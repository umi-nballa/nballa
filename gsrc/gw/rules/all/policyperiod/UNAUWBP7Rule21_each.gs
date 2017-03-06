package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBP7Rule21_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {
        period.BP7Line.BP7Locations.each( \ elt ->
        {
          elt.Buildings.each( \ elt1 ->
          {
            if(elt1.PredominentOccType_Ext==typekey.BP7PredominentOccType_Ext.TC_BUILDINGOWNER ||  elt1.PredominentOccType_Ext==typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMUNITOWNER
            || elt1.PredominentOccType_Ext==typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMASSOCIATION && DateUtil.addMonths(period.DateLastInspection_Ext,20)>new java.util.Date())
              return RuleEvaluationResult.execute()

          }
          )
        })
      }

    return RuleEvaluationResult.skip()

  }

}