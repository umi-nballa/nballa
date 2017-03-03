package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 8:13 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPPolicy implements IRuleCondition<PolicyPeriod> {

    override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

      if(period.CPLineExists or  period.GLLineExists)  {
        return RuleEvaluationResult.execute()
      }
        return RuleEvaluationResult.skip()
      }
    }