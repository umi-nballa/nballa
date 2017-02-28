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
class UWHOHazardScoreis2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var hazardScore = homeowners.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext ? homeowners.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext : homeowners.Dwelling.HOLocation.FirelineAdjHaz_Ext

    if(hazardScore != null &&  hazardScore == typekey.HOAdjustedHazardScore_Ext.TC_2)
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}