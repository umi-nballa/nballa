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
class UWHOFireLine_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowners.Dwelling.HOLocation.FirelinemthlvlMatchLevel_Ext != typekey.TUNAMatchLevel_Ext.TC_EXACT ||
        homeowners.dwelling.HOLocation.FirelineAdjHazMatchLevel_Ext != typekey.TUNAMatchLevel_Ext.TC_EXACT ||
        homeowners.dwelling.HOLocation.FirelineSHIAMatchLevel_Ext != typekey.TUNAMatchLevel_Ext.TC_EXACT ||
        homeowners.dwelling.HOLocation.FirelinePropHazMatchLevel_Ext != typekey.TUNAMatchLevel_Ext.TC_EXACT ||
        homeowners.dwelling.HOLocation.FirelineFuelMatchLevel_Ext != typekey.TUNAMatchLevel_Ext.TC_EXACT||
        homeowners.dwelling.HOLocation.FirelinemthlvlMatchLevel_Ext != typekey.TUNAMatchLevel_Ext.TC_EXACT)
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}