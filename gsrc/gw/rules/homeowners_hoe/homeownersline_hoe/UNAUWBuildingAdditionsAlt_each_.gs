package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBuildingAdditionsAlt_each_ implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.HODW_BuildingAdditions_HOE_ExtExists && homeowner.Dwelling.HODW_BuildingAdditions_HOE_Ext.HasHODW_BuildAddInc_HOETerm
    && homeowner.Dwelling.HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm.Value.doubleValue()>homeowner.Dwelling.PersonalPropertyLimitCovTerm.Value.doubleValue())
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}