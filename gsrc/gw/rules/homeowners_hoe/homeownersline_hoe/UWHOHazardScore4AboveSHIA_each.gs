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
class UWHOHazardScore4AboveSHIA_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var hazardScore = homeowners.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext ? homeowners.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext : homeowners.Dwelling.HOLocation.FirelineAdjHaz_Ext
    var SHIA = homeowners.Dwelling.HOLocation.OverrideFirelineSHIA_Ext ? homeowners.Dwelling.HOLocation.FirelineSHIAOverridden_Ext : homeowners.Dwelling.HOLocation.FirelineSHIA_Ext
    if(hazardScore != null &&  typekey.HOAdjustedHazardScore_Ext.TF_4ORMORE.TypeKeys.contains(hazardScore) &&  SHIA.equalsIgnoreCase("yes"))
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}