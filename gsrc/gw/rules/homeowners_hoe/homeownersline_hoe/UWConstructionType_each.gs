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
class UWConstructionType_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    var constructionType = homeowner.Dwelling.OverrideConstructionType_Ext ? homeowner.Dwelling.ConstTypeOverridden_Ext : homeowner.Dwelling.ConstructionType
    var conTypeL1 = homeowner.Dwelling.OverrideConstructionTypeL1_Ext ? homeowner.Dwelling.ConstTypeOverriddenL1_Ext : homeowner.Dwelling.ConstructionType
    var contypeL2 = homeowner.Dwelling.OverrideConstructionTypeL2_Ext ? homeowner.Dwelling.ConstTypeOverriddenL2_Ext : homeowner.Dwelling.ConstructionTypeL2_Ext
    if((constructionType != null && constructionType == typekey.ConstructionType_HOE.TC_ICF_EXT
    || constructionType == typekey.ConstructionType_HOE.TC_L ) ||
       (conTypeL1!= null &&  conTypeL1 == typekey.ConstructionType_HOE.TC_ICF_EXT
        || conTypeL1 == typekey.ConstructionType_HOE.TC_L ) ||
       (contypeL2 != null &&  contypeL2 == typekey.ConstructionType_HOE.TC_ICF_EXT
        || contypeL2 == typekey.ConstructionType_HOE.TC_L )){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}