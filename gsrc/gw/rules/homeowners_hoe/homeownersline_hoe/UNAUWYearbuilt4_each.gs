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
class UNAUWYearbuilt4_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.YearBuilt>=1937 && homeowner.Dwelling.YearBuilt<=1954 && homeowner.Dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists
    && homeowner.Dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HasHODW_Retrofitted_HOETerm && homeowner.Dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HODW_Retrofitted_HOETerm.OptionValue.Value.doubleValue()==1.0)

            return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}