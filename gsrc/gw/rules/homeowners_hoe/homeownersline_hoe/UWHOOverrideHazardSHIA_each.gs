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
class UWHOOverrideHazardSHIA_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowners.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext || homeowners.Dwelling.HOLocation.OverrideFirelineSHIA_Ext
        || homeowners.Dwelling.HOLocation.OverrideFirelinePropHaz_Ext )
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}