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
class UNADistMBOWMultipleTuna_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner?.Dwelling.HOLocation.DistBOWMatchLevel_Ext == typekey.TUNAMatchLevel_Ext.TC_USERSELECTED &&  homeowner?.Dwelling.FloodCoverage_Ext &&
    homeowner.HOLocation.PolicyLocation.State.Code=="FL")
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}