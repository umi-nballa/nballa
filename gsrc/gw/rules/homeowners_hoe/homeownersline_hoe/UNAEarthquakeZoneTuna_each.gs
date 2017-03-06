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
class UNAEarthquakeZoneTuna_each implements IRuleCondition<HomeownersLine_HOE>{

  //UW ISSUE code UNAUWIEarthQuakeTuna_ext

  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner?.Dwelling.EarthQuakeTer_Ext==null && homeowner?.Dwelling.EarthquakeCoverage_Ext)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}