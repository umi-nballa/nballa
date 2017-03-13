package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 3/1/17
 * Time: 8:35 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPPCExact implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)  {
      period.CPLine.CPLocations.each( \ elt ->
      {
          elt.Buildings.each( \ elt1 ->
          {
            if(elt1.FirePCCodeMatchLevel_Ext!=typekey.TunaMatchLevel_Ext.TC_EXACT)
              return RuleEvaluationResult.execute()

          })
      })
    }
    return RuleEvaluationResult.skip()
  }
}