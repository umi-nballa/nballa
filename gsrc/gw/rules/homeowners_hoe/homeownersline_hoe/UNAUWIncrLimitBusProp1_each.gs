package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWIncrLimitBusProp1_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    if(shouldExecuteRule(homeowner)){
      return RuleEvaluationResult.execute()
    }else{
      return RuleEvaluationResult.skip()
    }
  }

  private function shouldExecuteRule(hoLine : HomeownersLine_HOE) : boolean{
    return hoLine.Dwelling.HODW_BusinessProperty_HOE_ExtExists
       and hoLine.Dwelling.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.LimitDifference > 0
       and ConfigParamsUtil.getList(tc_IncreasedBusinessPropertyUWIssueStates, hoLine.BaseState)?.contains(hoLine.BaseState.Code)
  }
}