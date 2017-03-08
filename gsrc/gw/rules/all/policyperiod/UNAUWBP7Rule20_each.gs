package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.plugin.claimsearch.cc800.GWClaimSearchPlugin
uses gw.losshistory.ClaimSearchCriteria
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBP7Rule20_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {
       var claimsearch = new GWClaimSearchPlugin()
        var criteria = new ClaimSearchCriteria()
        criteria.Policy = period.Policy
        criteria.PolicyNumber=period.PolicyNumber
        criteria.Account=period.Policy.Account

        claimsearch.searchForClaims(criteria).Claims.each( \ elt ->
        {
          if(DateUtil.addMonths(elt.LossDate, 15)>new java.util.Date())
            return RuleEvaluationResult.execute()

        })

       }
    return RuleEvaluationResult.skip()

  }

}