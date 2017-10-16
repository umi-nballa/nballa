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
class UWDoubleWallCostal_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(( homeowner.Dwelling.ConstructionTypeOrOverride == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL ||
        homeowner.Dwelling.ConstructionTypeL2OrOverride == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL) &&
        (homeowner.Dwelling.HOLocation.DistToCoastOrOverride == typekey.DistToCoastOverridden_Ext.TC_0TO500FT)) {
        return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }


}