package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/2/17
 * Time: 5:43 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPLocationCounty2_PolicyChange implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)
    {
      period.CPLine.CPLocations.each( \ elt ->
      {
        if(elt.Location.County.equalsIgnoreCase("Hernando"))
          return RuleEvaluationResult.execute()
      })
    }
    return RuleEvaluationResult.skip()
  }
}