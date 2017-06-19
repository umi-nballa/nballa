package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWEQCovA_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists && homeowner.Dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HasHODW_EQCovA_HOETerm &&
        (homeowner.Dwelling.CoverageAEstRepCostValue_Ext!=null && Double.parseDouble(homeowner.Dwelling.CoverageAEstRepCostValue_Ext)!=
    homeowner.Dwelling.HODW_Comp_Earthquake_CA_HOE_Ext.HODW_EQCovA_HOETerm.Value.doubleValue()))
      {
            return RuleEvaluationResult.execute()


       }
   return RuleEvaluationResult.skip()
  }


}