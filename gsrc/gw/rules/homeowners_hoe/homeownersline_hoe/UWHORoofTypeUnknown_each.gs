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
class UWHORoofTypeUnknown_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var roofType = homeowners.Dwelling.OverrideRoofType_Ext ? homeowners.Dwelling.RoofingMaterialOverridden_Ext : homeowners.Dwelling.RoofType

    if(roofType != null && roofType == typekey.RoofType.TC_UNKNOWN_EXT  )
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}