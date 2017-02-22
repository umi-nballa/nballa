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
class UNAUWLimitedFungi_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.HODW_FungiCov_HOEExists && homeowner.Dwelling.HODW_FungiCov_HOE.HasHODW_FungiSectionILimit_HOETerm
    && homeowner.Dwelling.HODW_FungiCov_HOE.HODW_FungiSectionILimit_HOETerm.OptionValue.Value.doubleValue()>5000)   //// C H E C K
      {
            return RuleEvaluationResult.execute()


       }
   return RuleEvaluationResult.skip()
  }


}