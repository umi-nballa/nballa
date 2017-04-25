package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UW2IndOccpancySecondary_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.Policy.Account.AccountOrgType == AccountOrgType.TC_TWOINDOTHERTHANSPOUSAL_EXT
        && period.HomeownersLine_HOE?.Dwelling.DwellingUsage == tc_sec ){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}