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
class UWHORoofShape_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var roofShape = homeowners.Dwelling.OverrideRoofShape_Ext ? homeowners.Dwelling.RoofShapeOverridden_Ext : homeowners.Dwelling.RoofShape_Ext
    var constructionType = homeowners.Dwelling.OverrideConstructionType_Ext ? homeowners.Dwelling.ConstTypeOverridden_Ext : homeowners.Dwelling.ConstructionType
    var conTypeL1 = homeowners.Dwelling.OverrideConstructionTypeL1_Ext ? homeowners.Dwelling.ConstTypeOverriddenL1_Ext : homeowners.Dwelling.ConstructionType
    var contypeL2 = homeowners.Dwelling.OverrideConstructionTypeL2_Ext ? homeowners.Dwelling.ConstTypeOverriddenL2_Ext : homeowners.Dwelling.ConstructionTypeL2_Ext

    var roofType =     homeowners.Dwelling.OverrideRoofType_Ext ? homeowners.Dwelling.RoofingMaterialOverridden_Ext : homeowners.Dwelling.RoofType

    if ((roofShape != null &&  roofShape == typekey.RoofShape_Ext.TC_FLAT ) &&
     ( (constructionType != null &&
          (constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ||
              constructionType == typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY))  ||
      (conTypeL1 != null &&
        (conTypeL1 == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ||
            conTypeL1 == typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY)) ||
      (contypeL2 != null &&
        (contypeL2 == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ||
            contypeL2 == typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY)))  &&
       (roofType != null && roofType != typekey.RoofType.TC_REINFORCEDCONCRETE_EXT) )
         {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}