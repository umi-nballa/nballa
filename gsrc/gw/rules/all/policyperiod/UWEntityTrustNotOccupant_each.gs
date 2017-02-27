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
class UWEntityTrustNotOccupant_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.Policy.Account.AccountOrgType == AccountOrgType.TC_TRUST_EXT
      && period.TrustResidings.where( \ elt -> elt.TrustResident == TrustResident_Ext.TC_OCCUPANTNOTPARTYTOTRUST).HasElements ){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}