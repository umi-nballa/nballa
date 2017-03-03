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

//Any policy where CTR form has been requested and not received


class UNAUWCTRReq_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner.AssociatedPolicyPeriod.ConsentToRate_Ext && !homeowner.AssociatedPolicyPeriod.ConsentToRateReceived_Ext)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}