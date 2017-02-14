package gw.rules.cp.cplocations

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

class cpBoilerOnPremises_each implements IRuleCondition<CPLocation> {
  override function evaluateRuleCriteria(locations: CPLocation): RuleEvaluationResult {
    var buildings = locations.Buildings*.Building.where(
        \ building -> building.HeatingBoilerOnPremises)
    if (buildings.HasElements) {
      return RuleEvaluationResult.execute("Location(" + locations + "):"
          + buildings.map(\ building -> building.DisplayName).join(", "))
    } else {
      return RuleEvaluationResult.skip()
    }
  }
}
