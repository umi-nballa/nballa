package gw.rules.pa.vehicles

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.pl.currency.MonetaryAmount

class VehicleCostAndMileage implements IRuleCondition<PersonalVehicle> {
  static final var COST_LIMIT = new MonetaryAmount(40000, typekey.Currency.TC_USD)
  static final var MILEAGE_LIMIT = 25000

  override function evaluateRuleCriteria(vehicle: PersonalVehicle) : RuleEvaluationResult {
    if (vehicle.CostNew >= COST_LIMIT and vehicle.AnnualMileage >= MILEAGE_LIMIT) {
      return RuleEvaluationResult.execute(vehicle.DisplayName)
    }
    return RuleEvaluationResult.skip()
  }
}
