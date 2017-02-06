package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

uses java.util.Date

class PolicyPeriodEffectiveDate implements IRuleCondition<PolicyPeriod> {
  static final var LIMIT = -60

  override function evaluateRuleCriteria(policyPeriod : PolicyPeriod) : RuleEvaluationResult {
    if (policyPeriod.EditEffectiveDate < Date.CurrentDate.addDays(LIMIT)) {
      return RuleEvaluationResult.execute(policyPeriod.EditEffectiveDate)
    } else {
      return RuleEvaluationResult.skip()
    }
  }
}