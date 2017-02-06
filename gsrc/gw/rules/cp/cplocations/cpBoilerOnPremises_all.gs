package gw.rules.cp.cplocations

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

uses java.util.ArrayList
uses java.util.LinkedHashMap

class cpBoilerOnPremises_all implements IRuleCondition<CPLocation[]> {
  override function evaluateRuleCriteria(locations: CPLocation[]) : RuleEvaluationResult {
    var buildingsByLocation = new LinkedHashMap<CPLocation, Building[]>()
    locations.each(\ location -> {
      var matches = location.Buildings*.Building.where(\building -> building.HeatingBoilerOnPremises)
      if (!matches.IsEmpty) {
        buildingsByLocation.put(location, matches)
      }
    })

    if (buildingsByLocation.Empty) {
      return RuleEvaluationResult.skip()
    } else {
      var result = new ArrayList<String>()
      buildingsByLocation.eachKeyAndValue(\ location, buildings -> {
        var term = "Location(" + location + "):"
            + buildings.map(\ building -> building.DisplayName).join(", ")
        result.add(term)
      })
      return RuleEvaluationResult.execute(result.join("; "))
    }
  }
}