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
class UWQuestionBusInsuredLoc_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var conductsBusinessAtInsuredLocation = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CONDUCTS_BUSINESS_DF.QuestionCode).BooleanAnswer
    var typeOfBusinessConducted = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_DF.QuestionCode).ChoiceAnswer.ChoiceCode
    var businessTypesToEvaluate = {"Retail", "Service", "HomeOffice", "Other"}

    if(conductsBusinessAtInsuredLocation and businessTypesToEvaluate.containsIgnoreCase(typeOfBusinessConducted)){
      return RuleEvaluationResult.execute()
    }else{
      return RuleEvaluationResult.skip()
    }
  }
}