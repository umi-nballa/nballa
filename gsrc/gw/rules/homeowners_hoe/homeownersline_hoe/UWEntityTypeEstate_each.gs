package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWEntityTypeEstate_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.Policy.Account.AccountOrgType == AccountOrgType.TC_ESTATE_EXT ||
        period.Policy.Account.AccountOrgType == AccountOrgType.TC_LLC ||
        period.Policy.Account.AccountOrgType == AccountOrgType.TC_PARTNERSHIP ||
        period.Policy.Account.AccountOrgType == AccountOrgType.TC_CORPORATION_EXT ||
        period.Policy.Account.AccountOrgType == AccountOrgType.TC_IRA_EXT ||
        period.Policy.Account.AccountOrgType == AccountOrgType.TC_ASSOCIATION_EXT ||
        period.Policy.Account.AccountOrgType == AccountOrgType.TC_CHURCH_EXT){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}