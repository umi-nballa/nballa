package gw.rules.cp.cplocations

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction

/***************************************************************************************************************************************************
*
*  Rule cpBoilerOnPremisesActivity creates an activity at prequote, prequote release, and/or pre-bind for each building that has a boiler on premises
*                                  
***************************************************************************************************************************************************/
class cpBoilerOnPremisesActivity implements IRuleCondition<CPLocation>,
    IRuleAction<CPLocation, Object> {
  override function evaluateRuleCriteria(location: CPLocation): RuleEvaluationResult {
    var buildings = location.Buildings*.Building.where(\building -> building.HeatingBoilerOnPremises)
    if (buildings.HasElements) {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("inspection_fee_service")
      var msg = displaykey.Web.Policy.CP.Location.CPBuilding.BoilerOnPremises
          + (" Location(" + location + "):"
              + buildings.map(\building -> building.DisplayName).join(" , "))
      if (not location.Branch.Job.AllOpenActivities.hasMatch(
          \activity -> (activity.ActivityPattern == activityPattern)
              and (activity.Description == msg))) {
        return RuleEvaluationResult.execute(activityPattern, msg)
      }
    }
    return RuleEvaluationResult.skip()
  }

  override function satisfied(location : CPLocation, context : Object,
                              result : RuleEvaluationResult) {
    var activityPattern = result.PrimaryValue as ActivityPattern
    var msg = result.SecondaryValue as String
    location.Branch.Job.createRoleActivity(typekey.UserRole.TC_UNDERWRITER,
        activityPattern,
        null,
        msg)
  }
}
