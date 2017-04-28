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
class UWQuestionPoolsDive_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var hasSwimmingPool = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.HAS_SWIMMING_POOL.QuestionCode).BooleanAnswer
    var swimmingPoolHasDivingBoardOrSlide = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.SWIMMING_POOL_HAS_SLIDE.QuestionCode).BooleanAnswer

    return (hasSwimmingPool and swimmingPoolHasDivingBoardOrSlide) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }
}