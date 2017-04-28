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
class UWQuestionTrampolineTen_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var isNotOwnerOccupied = homeowner.Dwelling.Occupancy != typekey.DwellingOccupancyType_HOE.TC_OWNER
    var tenantUsesTrampoline = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.HAS_TRAMPOLINE_ETC_DF.QuestionCode).BooleanAnswer

    return (isNotOwnerOccupied and tenantUsesTrampoline) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }
}