package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/8/17
 * Time: 6:02 PM
 * To change this template use File | Settings | File Templates.
 */
class UNARoofShapeChangeActivity_each implements IRuleCondition<HomeownersLine_HOE> {

  override function evaluateRuleCriteria(holine : HomeownersLine_HOE) : RuleEvaluationResult {

    if(holine.Dwelling.OverrideRoofShape_Ext && (holine.HOLocation.PolicyLocation.State.Code=="FL" || holine.HOLocation.PolicyLocation.State.Code=="SC")  )
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("ofac_csr")

      var user = una.config.activity.OfacUtil.findUserByUsername("ofaccsr")
      if(user==null)
      {
        user = una.config.activity.OfacUtil.findUserByUsername("su")
      }
      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="ofac_csr")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
        activity.assign(user.RootGroup,user)
      }
    }



    return RuleEvaluationResult.skip()

  }

}