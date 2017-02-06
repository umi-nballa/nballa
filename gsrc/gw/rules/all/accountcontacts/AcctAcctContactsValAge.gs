package gw.rules.all.accountcontacts

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

class AcctAcctContactsValAge implements IRuleCondition<AccountContact> {
  static final var LIMIT = 30

  override function evaluateRuleCriteria(contact: AccountContact) : RuleEvaluationResult {
    if (contact.Person) {
      if ((contact.Contact as Person).Age < LIMIT) {
        return RuleEvaluationResult.execute(contact.Contact.DisplayName)
      }
    }

    return RuleEvaluationResult.skip()
  }

}