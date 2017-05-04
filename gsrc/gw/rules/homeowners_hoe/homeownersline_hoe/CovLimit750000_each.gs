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
class CovLimit750000_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var isFirePolicy = HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(homeowner.HOPolicyType)
    var dwellingLimit = homeowner.Dwelling.DwellingLimitCovTerm.Value
    var uwThreshold = HOE_UWConstant.covALimit_750000
    var baseState = homeowner.BaseState
    var shouldEvaluate = true

    if(isFirePolicy and baseState != TC_CA){
      shouldEvaluate = homeowner.Dwelling.ResidenceType == TC_Condo
    }

    if(shouldEvaluate and dwellingLimit > uwThreshold){
      return RuleEvaluationResult.execute()
    }else{
      return RuleEvaluationResult.skip()
    }
  }
}