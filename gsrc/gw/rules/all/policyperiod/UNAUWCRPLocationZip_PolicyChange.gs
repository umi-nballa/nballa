package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/2/17
 * Time: 5:36 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPLocationZip_PolicyChange implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

  if(period.CPLineExists)
  {
    period.CPLine.CPLocations.each( \ elt ->
    {
    if(elt.Location.PostalCode.equals("32563") )
    return RuleEvaluationResult.execute()
    })
  }
  return RuleEvaluationResult.skip()
  }
}