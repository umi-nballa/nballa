package gw.rules.pa.policydrivers

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction

/***************************************************************************************************************************************************
*
*  Rule ExcludedDriverActivity creates an activity at prequote, prequote release, and/or pre-bind for each excluded driver.
*                                 
*  Please reference End Note #1 re: the prior Rules Framework Ref. Implementation's 'paaupdpr00001' rule, which was the model for this
*  Ref. Implementation's ExcludedDriverActivity rule.
* 
***************************************************************************************************************************************************/
class ExcludedDriverActivity implements IRuleCondition<PolicyDriver>,
    IRuleAction<PolicyDriver, Object> {
  override function evaluateRuleCriteria(driver: PolicyDriver): RuleEvaluationResult {
    if (driver.Excluded) {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("excludeddriver")
      var msg = displaykey.UWIssue.PersonalAuto.ExcludedDriver.LongDesc(driver.DisplayName)
      if (driver.Branch.Job.AllOpenActivities.hasMatch(
          \activity -> (activity.ActivityPattern == activityPattern)
              and (activity.Description == msg))) {
//        driver.Branch.Job.createRoleActivity(typekey.UserRole.TC_UNDERWRITER,
//            activityPattern, null, msg)
        return RuleEvaluationResult.execute(activityPattern, msg)
      }
    }
    return RuleEvaluationResult.skip()
  }

  override function satisfied(driver : PolicyDriver, context : Object,
                              result : RuleEvaluationResult) {
    var activityPattern = result.PrimaryValue as ActivityPattern
    driver.Branch.Job.createRoleActivity(typekey.UserRole.TC_UNDERWRITER,
        activityPattern, null, result.SecondaryValue as String)
  }
}

/**** End Notes ************************************************************************************************************************************
*     
*  1. The prior Rules Framework Ref. Implementation rule ('paaupdpr00001') from which this ExcludedDriverActivity rule was modeled
*     is provided below for reference purposes:
*     
*        class paaupdpr00001  extends BaseRule {
*
*        construct() {
*          brName = this.IntrinsicType.Name
*          brType = "policydriver"
*        }
*
*        override function executeDriverRule (driver : PolicyDriver, polPer : PolicyPeriod) {
*          var activityPattern = ActivityPattern("sample_pattern:53"  )
*
*          if(driver.Excluded) {
*            var activities = polPer.Policy.Account.AllOpenActivities.toTypedArray()
*      
*            if (activities.firstWhere(\ a -> a.ActivityPattern == activityPattern and
*                                             a.Description == displaykey.Activities.ExcludedDriver(driver.DisplayName)) == null) {
* 
*              var activity = polPer.Policy.Account.newActivity(activityPattern)
*              activity.Description = displaykey.Activities.ExcludedDriver(driver.DisplayName)
*            }
*          }
*        }
*      }
* 
*  2. _valResult instance variable assignment: 
*        i.      _valResult is initialized to null w/in BaseRule prior to entering the rule's evalRuleCriteria override.
* 
*        ii(a).  In a typical implementation, each rule assigns text to _valResult that describes evalRuleCriteria's 
*                detected "offense" (for "each") or offenses ("all").  
*                
*                _valResult's text (if any) is then added to the UWIssue or validation warning/error message body. 
* 
*        ii(b).  If no offense exists (as will always be the case for autoupdate rules), the rule does not (must not) assign a value to _valResult
*                (i.e. leave it at its pre-rule null value assignment.)
*             
*                By not assigning a value to _valResult w/in the rule, the rule is implicitly instructing the BaseRule not to 
*                exercise the associated rule action (e.g. do not create UWIssue, do not raise validation warning or error) 
*
******************************************************************************************************************************************************/
