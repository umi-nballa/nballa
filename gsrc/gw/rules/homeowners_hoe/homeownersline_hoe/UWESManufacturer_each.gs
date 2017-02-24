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
class UWESManufacturer_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    if(homeowner.Dwelling.PanelManufacturer_Ext == typekey.PanelManufacturer_Ext.TC_FEDERALPACIFIC){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}