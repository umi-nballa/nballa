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
class UNAUWIncrPersProp50CovA_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    if(  homeowner.Dwelling?.HODW_Personal_Property_HOEExists && homeowner.Dwelling.HODW_Personal_Property_HOE?.HasHODW_PersonalPropertyLimit_HOETerm &&   homeowner.Dwelling?.CoverageALimitValue_Ext!=null &&
    homeowner.Dwelling.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.LimitDifference?.doubleValue()>0.5*Double.parseDouble(homeowner.Dwelling?.CoverageALimitValue_Ext))
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}