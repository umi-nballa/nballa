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
class UWQuestionNoOfRental_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var numberOfRentalUnits = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TOTAL_RENTAL_UNITS_COMMON_OWNERSHIP_DF.QuestionCode).ChoiceAnswer.ChoiceCode

    return (numberOfRentalUnits != null and {"6", "7", "8", "9", "10", "MoreThanTen"}.containsIgnoreCase(numberOfRentalUnits)) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }
}