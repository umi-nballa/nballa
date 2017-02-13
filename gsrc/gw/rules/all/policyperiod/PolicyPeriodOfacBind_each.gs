package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

class PolicyPeriodOfacBind_each implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(policyPeriod : PolicyPeriod) : RuleEvaluationResult {
    if(policyPeriod.ofaccontact!=null && policyPeriod.ofaccontact.length>0)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("ofac_csr")

      var user = una.config.activity.OfacUtil.findUserByUsername("ofaccsr")
      if(user==null)
      {
        user = una.config.activity.OfacUtil.findUserByUsername("su")
      }
      if(policyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="ofac_csr")==null)
      {
        var activity =  activityPattern.createJobActivity(policyPeriod.Bundle, policyPeriod.Job, null, null, null, null, null, null, null)
        activity.assign(user.RootGroup,user)
      }

      return RuleEvaluationResult.skip()//execute(activityPattern)
    } //}
    else
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("ofac_csr")

      var user = una.config.activity.OfacUtil.findUserByUsername("ofaccsr")
      if(user==null)
      {
        user = una.config.activity.OfacUtil.findUserByUsername("su")
      }
      if(policyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="ofac_csr")==null)
      {
        var activity =  activityPattern.createJobActivity(policyPeriod.Bundle, policyPeriod.Job, null, null, null, null, null, null, null)
        activity.assign(user.RootGroup,user)
      }

      return RuleEvaluationResult.skip()//execute(activityPattern)
    }


  }
}