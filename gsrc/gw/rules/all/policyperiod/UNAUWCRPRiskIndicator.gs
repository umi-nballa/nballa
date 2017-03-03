package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 11:19 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPRiskIndicator implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)
    {
      if(period.RiskIndicator_Ext != null and period.RiskIndicator_Ext == true){
        return RuleEvaluationResult.execute()
      }
    }
    return RuleEvaluationResult.skip()
  }
}