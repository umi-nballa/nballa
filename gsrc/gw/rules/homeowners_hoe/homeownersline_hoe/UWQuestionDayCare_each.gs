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
class UWQuestionDayCare_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var isBusinessConducted = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CONDUCTS_BUSINESS_HO.QuestionCode).BooleanAnswer
    var typeOfBusiness = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_HO.QuestionCode).ChoiceAnswer.ChoiceCode
    var evaluatedChoices = {"ChildDaycare", "AssistedLiving", "AdultDaycare"}

    return (isBusinessConducted and typeOfBusiness != null and evaluatedChoices.containsIgnoreCase(typeOfBusiness)) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }

}