package gw.rules.pa.policydrivers

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

class DriverUnder25_all implements IRuleCondition<PolicyContactRole[]> {
  override function evaluateRuleCriteria(contacts: PolicyContactRole[]) : RuleEvaluationResult {
    var driversUnder25 = contacts.where(
        \p -> (p.AccountContactRole.AccountContact.Contact as Person).Age < 25)
    return RuleEvaluationResult.executeIfMatch(driversUnder25)
  }
}
