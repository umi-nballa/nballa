package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPCRT implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if( period.ConsentToRateReceived_Ext != null and  period.ConsentToRateReceived_Ext == true ){
        return RuleEvaluationResult.execute()
      }
    return RuleEvaluationResult.skip()
  }
}