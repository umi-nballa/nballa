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
class UWHORoofType_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var roofType =     homeowners.Dwelling.OverrideRoofType_Ext ? homeowners.Dwelling.RoofingMaterialOverridden_Ext : homeowners.Dwelling.RoofType

    if(roofType != null && roofType == typekey.RoofType.TC_ALUMINUM_EXT ||
        roofType == typekey.RoofType.TC_ALUMINUM_EXT ||
        roofType == typekey.RoofType.TC_ASBESTOSSHINGLE_EXT ||
        roofType == typekey.RoofType.TC_BUILTUP_EXT ||
        roofType == typekey.RoofType.TC_COMPOSITIONROLLROOFING_EXT ||
        roofType == typekey.RoofType.TC_COPPER ||
        roofType == typekey.RoofType.TC_MEMBRANE_EXT ||
        roofType == typekey.RoofType.TC_ROLLEDTARPAPER_EXT ||
        roofType == typekey.RoofType.TC_SOD_EXT ||
        roofType == typekey.RoofType.TC_SPRAYEDPOLYURETHANEFOAM_EXT ||
        roofType == typekey.RoofType.TC_TARANDGRAVEL_EXT ||
        roofType == typekey.RoofType.TC_TIN_EXT ||
        roofType == typekey.RoofType.TC_WOODSHAKE_EXT ||
        roofType == typekey.RoofType.TC_TARANDGRAVEL_EXT )
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}