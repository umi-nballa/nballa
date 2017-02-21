package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAPriorCarrier_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    var priorPolicies=homeowner.AssociatedPolicyPeriod.Policy.PriorPolicies

    if(priorPolicies.firstWhere(\elt->elt.Carrier == "UNA" || elt.Carrier=="Other")!=null)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}