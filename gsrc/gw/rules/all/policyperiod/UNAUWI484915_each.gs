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
class UNAUWI484915_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

 //   if(homeowner?.Dwelling.HOLocation.BCEGMatchLevel_Ext == typekey.TUNAMatchLevel_Ext.TC_USERSELECTED || homeowner?.Dwelling.HOLocation.BCEG_Ext==null)
 //     return RuleEvaluationResult.execute()

    if(period.CPLineExists)
    {
      period.CPLine.CPLocations.each( \ elt ->
      {
        elt.Buildings.each( \ elt2 ->
        {
          if(elt2.BCEG_Ext==null  || elt2.BCEGMatchLevel_Ext==typekey.TunaMatchLevel_Ext.TC_USERSELECTED)
            return RuleEvaluationResult.execute()
        }
        )
      })
    }

    if(period.BP7LineExists)
    {
      period.BP7Line.BP7Locations.each( \ elt ->
      {
        elt.Buildings.each( \ elt2 ->
        {
          if(elt2.BldgCodeEffGrade==null || elt2.BCEGMatchLevel_Ext==typekey.TunaMatchLevel_Ext.TC_USERSELECTED)
            return RuleEvaluationResult.execute()
        } )
      }
      )
    }



    return RuleEvaluationResult.skip()
  }


}