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
class UWQuestionHillSide_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var isBuiltOnSteepHillside = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.BUILT_ON_STEEP_HILLSIDE_DF.QuestionCode).BooleanAnswer

    return (isBuiltOnSteepHillside) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }


}