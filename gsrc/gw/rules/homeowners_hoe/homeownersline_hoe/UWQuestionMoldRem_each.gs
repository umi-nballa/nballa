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
class UWQuestionMoldRem_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var hadMold = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.HAS_MOLD_DAMAGE.QuestionCode).BooleanAnswer
    var moldHasBeenRemediated = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.MOLD_DAMAGE_REMEDIATED.QuestionCode).BooleanAnswer

    return (hadMold and moldHasBeenRemediated) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
   }
}