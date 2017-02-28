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
class UWProtectionClass9_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var protectionClass = homeowners.Dwelling.HOLocation.OverrideDwellingPCCode_Ext  ?
        homeowners.Dwelling.HOLocation.DwellingPCCodeOverridden_Ext :  homeowners.Dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext
    if(protectionClass != null && protectionClass == ProtectionClassCode_Ext.TC_9 && !homeowners.Dwelling.HOLocation.ProtectedSubDivision_Ext){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}