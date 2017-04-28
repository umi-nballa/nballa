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
class UWQuestionHomeSharing_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var isUsedForHomeSharing = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.IS_DWELLING_USED_FOR_HOME_SHARING.QuestionCode).BooleanAnswer

    return (isUsedForHomeSharing) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }


}