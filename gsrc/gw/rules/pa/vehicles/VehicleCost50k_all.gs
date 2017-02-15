package gw.rules.pa.vehicles

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.pl.currency.MonetaryAmount

class VehicleCost50k_all implements IRuleCondition<PersonalVehicle[]> {
  static final var LOWER_LIMIT = new MonetaryAmount(50000, Currency.TC_USD)
  static var UPPER_LIMIT = new MonetaryAmount(75000, Currency.TC_USD)

  override function evaluateRuleCriteria(vehicles : PersonalVehicle[]) : RuleEvaluationResult {
    return RuleEvaluationResult.executeIfMatch(
      vehicles.where(\ veh -> veh.CostNew >= LOWER_LIMIT and veh.CostNew < UPPER_LIMIT)
    )
  }
}