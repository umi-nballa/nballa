package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWI484913_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

  //  if(homeowner?.Dwelling.HOLocation.TerritoryCodeMatchLevel_Ext == typekey.TUNAMatchLevel_Ext.TC_USERSELECTED || homeowner?.Dwelling.HOLocation.TerritoryCodeTunaReturned_Ext==null)
  //    return RuleEvaluationResult.execute()

    if(period.CPLineExists)
    {
      period.PolicyLocations.each( \ elt ->
      {
        if(elt.TerritoryCodeTunaReturned_Ext==null || elt.TerritoryCodeMatchLevel_Ext==typekey.TunaMatchLevel_Ext.TC_USERSELECTED)
            return RuleEvaluationResult.execute()
        }
        )

    }

    if(period.BP7LineExists)
    {
      period.BP7Line.BP7Locations.each( \ elt ->
      {
        if(elt.TerritoryCodeTunaReturned_Ext==null || elt.TerritoryCodeMatchLevel_Ext==typekey.TunaMatchLevel_Ext.TC_USERSELECTED)
            return RuleEvaluationResult.execute()
        } )

    }



    return RuleEvaluationResult.skip()
  }


}