package gw.rules.pa.vehicles

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

class NoRedVehicles implements IRuleCondition<PersonalVehicle[]> {
  override function evaluateRuleCriteria(vehicles : PersonalVehicle[]): RuleEvaluationResult {
    var matches = vehicles.where(\ vehicle -> vehicle.Color == "Red")
    return RuleEvaluationResult.executeIfMatch(matches)
  }
}