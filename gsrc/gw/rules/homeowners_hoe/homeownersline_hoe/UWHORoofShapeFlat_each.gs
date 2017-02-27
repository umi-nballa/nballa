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
class UWHORoofShapeFlat_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {
    var roofShape = homeowners.Dwelling.OverrideRoofShape_Ext ? homeowners.Dwelling.RoofShapeOverridden_Ext : homeowners.Dwelling.RoofShape_Ext
    var roofType =     homeowners.Dwelling.OverrideRoofType_Ext ? homeowners.Dwelling.RoofingMaterialOverridden_Ext : homeowners.Dwelling.RoofType

    if ((roofShape != null &&  roofShape == typekey.RoofShape_Ext.TC_FLAT )
      &&  (roofType != null && roofType != typekey.RoofType.TC_REINFORCEDCONCRETE_EXT) )
         {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}