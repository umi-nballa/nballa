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
class UWQuestionMixOfBreed_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var ownsAggressiveDog = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.OWNS_AGGRESSIVE_DOG_HO.QuestionCode).BooleanAnswer
    var isOwnerOccupied = homeowner.Dwelling.Occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER

    return (isOwnerOccupied and ownsAggressiveDog) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }
}