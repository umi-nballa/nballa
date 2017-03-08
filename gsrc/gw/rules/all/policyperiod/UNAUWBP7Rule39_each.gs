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
class UNAUWBP7Rule39_each implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)  {
      period.BP7Line.BP7Locations.each( \ elt ->
      {
          elt.Buildings.each( \ elt1 ->
          {
            if(elt1.PredominentOccType_Ext==typekey.BP7PredominentOccType_Ext.TC_BOOCCUPANT)
              return RuleEvaluationResult.execute()

          })
      })
    }
    return RuleEvaluationResult.skip()
  }
}