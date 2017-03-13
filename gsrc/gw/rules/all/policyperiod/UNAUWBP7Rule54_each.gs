package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBP7Rule54_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {
        if(period?.ClaimFreeYear!=typekey.NoClaimFreeYears_Ext.TC_MORETHAN10 && Integer.parseInt(period?.ClaimFreeYear?.Code)<3)

                 return RuleEvaluationResult.execute()

            }

    return RuleEvaluationResult.skip()

  }

}