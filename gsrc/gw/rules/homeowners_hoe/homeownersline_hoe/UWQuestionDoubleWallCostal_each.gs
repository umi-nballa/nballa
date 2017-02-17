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
class UWQuestionDoubleWallCostal_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if((homeowner.Dwelling.ConstructionType == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL ||
        homeowner.Dwelling.ConstructionTypeOrOverride == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL ||
        homeowner.Dwelling.ConstructionTypeL1_Ext == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL ||
        homeowner.Dwelling.ConstructionTypeL1OrOverride == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL ||
        homeowner.Dwelling.ConstructionTypeL2_Ext == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL ||
        homeowner.Dwelling.ConstructionTypeL2OrOverride == typekey.ConstructionType_HOE.TC_STANDARDFRAMEDOUBLEWALL_EXTL) &&
        (homeowner.Dwelling.HOLocation.DistToCoast_Ext == typekey.DistToCoastOverridden_Ext.TC_0TO500FT ||
            homeowner.Dwelling.HOLocation.DistToCoastOverridden_Ext == typekey.DistToCoastOverridden_Ext.TC_0TO500FT) ){
        return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }


}