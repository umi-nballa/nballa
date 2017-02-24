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
class UWEntityTypeTrustPartnerShip_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.Policy.Account.AccountOrgType == AccountOrgType.TC_TRUST_EXT
      && period.TrustResidings.where( \ elt -> elt.TypeOfTrustRevocable).HasElements ){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}