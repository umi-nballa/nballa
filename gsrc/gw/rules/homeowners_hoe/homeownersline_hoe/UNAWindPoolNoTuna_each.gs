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
class UNAWindPoolNoTuna_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner?.dwelling.HOLocation.WindPool_Ext == null && homeowner.dwelling.HOLocation.WindPoolMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED
        && homeowner.HOLocation.PolicyLocation.State.Code=="TX" && homeowner.HOLocation.PolicyLocation.County.equalsIgnoreCase("Harris"))

      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}