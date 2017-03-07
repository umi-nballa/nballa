package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/2/17
 * Time: 6:28 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPCoverage implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)
    {
      var builds = period.CPLine.CPLocations.Buildings
      builds.each( \ building -> {
        if(building.CPSinkholeLossCoverage_EXTExists)
          return RuleEvaluationResult.execute()
      })
    }
    return RuleEvaluationResult.skip()
  }
}