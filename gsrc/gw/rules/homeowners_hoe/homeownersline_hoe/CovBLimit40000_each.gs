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
class CovBLimit40000_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
  if( homeowner.Dwelling.DPDW_Personal_Property_HOEExists
    and homeowner.Dwelling.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm?.Value < HOE_UWConstant.covBLimit_40000){
        return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }
}