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
class UNAUWCPRule1_each implements IRuleCondition<PolicyPeriod>{
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