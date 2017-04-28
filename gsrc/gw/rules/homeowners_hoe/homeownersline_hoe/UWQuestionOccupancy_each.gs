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
class UWQuestionOccupancy_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var isOwnerOccupied = homeowner.Dwelling.Occupancy ==  DwellingOccupancyType_HOE.TC_OWNER
    var unOccupiedForOver9Months = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.UNOCCUPIED_OVER_9_MONTHS_HO.QuestionCode).BooleanAnswer

    return (isOwnerOccupied and unOccupiedForOver9Months) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }


}