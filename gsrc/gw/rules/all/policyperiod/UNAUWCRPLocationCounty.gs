package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 7:35 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPLocationCounty implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)
    {
      period.CPLine.CPLocations.each( \ elt ->
      {
        if(elt.Location.County.equalsIgnoreCase("Pasco"))
          return RuleEvaluationResult.execute()
      })
    }
    return RuleEvaluationResult.skip()
  }
}