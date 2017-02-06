package gw.rules.pa.policydrivers

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

class DriverUnder25_each implements IRuleCondition<PolicyDriver> {

  override function evaluateRuleCriteria(driver : PolicyDriver) : RuleEvaluationResult {

    if ((driver.AccountContactRole.AccountContact.Contact as Person).Age < 25) {
      return RuleEvaluationResult.execute(
          (driver.AccountContactRole.AccountContact.Contact as Person).DisplayName,
          (driver.AccountContactRole.AccountContact.Contact as Person).Age
      )
    }

    return RuleEvaluationResult.skip()
  }

}