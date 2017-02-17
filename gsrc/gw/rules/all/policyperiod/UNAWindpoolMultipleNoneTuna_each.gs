package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 * US4849.18
 */
class UNAWindpoolMultipleNoneTuna_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)
    {
      period.CPLine.CPLocations.each( \ elt ->
      {
        elt.Buildings.each( \ elt2 ->
        {
          if(elt2.WindPoolMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED || elt2.Windpoolvalue_Ext==null)
            return RuleEvaluationResult.execute()
        }
        )
      })
    }
   return RuleEvaluationResult.skip()
  }


}