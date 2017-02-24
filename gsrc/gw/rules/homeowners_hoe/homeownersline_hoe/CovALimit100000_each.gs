package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses una.lob.ho.HOE_UWConstant
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class CovALimit100000_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    if( homeowner.Dwelling.DPDW_Dwelling_Cov_HOEExists
    and homeowner.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value < HOE_UWConstant.covALimit_100000){
    return RuleEvaluationResult.execute()
    }
    return RuleEvaluationResult.skip()
  }
}