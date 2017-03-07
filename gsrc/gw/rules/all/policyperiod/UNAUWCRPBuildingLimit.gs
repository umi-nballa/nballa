package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 7:38 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPBuildingLimit implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)
    {
      var builds = period.CPLine.CPLocations.Buildings
      builds.each( \ building -> {
        if(building.CPBldgCovExists and building.CPBldgCov.HasCPBldgCovLimitTerm and building.CPBldgCov.CPBldgCovLimitTerm.Value >= 10000000)
          return RuleEvaluationResult.execute()
      })
      }
    return RuleEvaluationResult.skip()
  }
}