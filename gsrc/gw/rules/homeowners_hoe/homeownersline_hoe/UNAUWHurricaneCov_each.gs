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
class UNAUWHurricaneCov_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.HODW_HurricaneCov_HOE_ExtExists && homeowner.Dwelling.HODW_HurricaneCov_HOE_Ext.HasHODW_HurricaneDeductible_HOETerm
    && homeowner.Dwelling.HODW_HurricaneCov_HOE_Ext.HODW_HurricaneDeductible_HOETerm.OptionValue.Value.doubleValue()<homeowner.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm?.Value)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}