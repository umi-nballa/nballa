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
class UNAUWMoldFungi_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.HODW_MoldFungiOtherMicrobes_HOE_ExtExists && homeowner.Dwelling.HODW_MoldRemediationCov_HOE_ExtExists &&
      homeowner.Dwelling.HODW_MoldRemediationCov_HOE_Ext.HasHODW_MoldRemedCovLimit_HOETerm && homeowner.Dwelling.HODW_MoldRemediationCov_HOE_Ext.HODW_MoldRemedCovLimit_HOETerm.OptionValue.Value.doubleValue()>0.25
    && homeowner.Dwelling.YearBuilt!=new java.util.Date().YearOfDate)
      {
            return RuleEvaluationResult.execute()


       }
   return RuleEvaluationResult.skip()
  }


}