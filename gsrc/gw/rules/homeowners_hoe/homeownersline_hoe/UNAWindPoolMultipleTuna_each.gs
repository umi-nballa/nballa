package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 * US4849.18
 */
class UNAWindPoolMultipleTuna_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner?.dwelling.HOLocation.WindPoolMatchLevel_Ext == typekey.TUNAMatchLevel_Ext.TC_USERSELECTED)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}