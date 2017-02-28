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
class UWResidentTypeTriQuadplex_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {


    if(homeowners.Dwelling.ResidenceType != null &&
        (homeowners.Dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_TRIPLEX_EXT ||
            homeowners.Dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_QUADPLEX_EXT)){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}