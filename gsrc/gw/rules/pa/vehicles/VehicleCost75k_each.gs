package gw.rules.pa.vehicles

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.pl.currency.MonetaryAmount

class VehicleCost75k_each implements IRuleCondition<PersonalVehicle> {
  static final var LIMIT = new MonetaryAmount(75000, typekey.Currency.TC_USD)

  override function evaluateRuleCriteria(vehicle : PersonalVehicle) : RuleEvaluationResult {
    if (vehicle.CostNew >= LIMIT) {
      return RuleEvaluationResult.execute(vehicle.DisplayName)
    }

    return RuleEvaluationResult.skip()
  }
}