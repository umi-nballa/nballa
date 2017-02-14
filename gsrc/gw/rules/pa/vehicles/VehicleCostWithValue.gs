package gw.rules.pa.vehicles

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.pl.currency.MonetaryAmount

class VehicleCostWithValue implements IRuleCondition<PersonalVehicle> {
  static final var LIMIT = new MonetaryAmount(40000, typekey.Currency.TC_USD)

  override function evaluateRuleCriteria(inObject : PersonalVehicle) : RuleEvaluationResult {
    if (inObject.CostNew >= LIMIT) {
      return RuleEvaluationResult.execute(inObject.DisplayName, inObject.CostNew)
    }
    return RuleEvaluationResult.skip()
  }
}
