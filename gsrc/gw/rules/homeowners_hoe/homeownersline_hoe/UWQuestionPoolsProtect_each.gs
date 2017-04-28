package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.UNAProductModelUtil.DwellingUWQuestionCodes

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWQuestionPoolsProtect_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var hasSwimmingPool = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.HAS_SWIMMING_POOL.QuestionCode).BooleanAnswer

    if(hasSwimmingPool){

    }

    return hasSwimmingPool and (hasIneligibleProtectivePoolDevice(homeowner.Branch) or !meetsProtectiveRegulation(homeowner.Branch)) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }

  private function hasIneligibleProtectivePoolDevice(branch : PolicyPeriod) : boolean {
    var poolProtectionDevice = branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.PRIMARY_SWIMMING_POOL_PROTECTION.QuestionCode).ChoiceAnswer.ChoiceCode
    return poolProtectionDevice != null and {"None", "HotTubCover"}.containsIgnoreCase(poolProtectionDevice)
  }

  private function meetsProtectiveRegulation(branch : PolicyPeriod) : boolean{
    var meetsProtectiveRegulation = branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.PRIMARY_SWIMMING_POOL_PROTECTION.QuestionCode).BooleanAnswer

    return meetsProtectiveRegulation != null and meetsProtectiveRegulation
  }
}