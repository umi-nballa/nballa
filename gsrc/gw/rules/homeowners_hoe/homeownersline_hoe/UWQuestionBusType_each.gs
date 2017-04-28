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
class UWQuestionBusType_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var conductsBusinessAtInsuredLocation = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CONDUCTS_BUSINESS_HO.QuestionCode).BooleanAnswer
    var typeOfBusinessConducted = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_HO.QuestionCode).ChoiceAnswer.ChoiceCode
    var businessTypesToEvaluate = {"Retail", "Service", "HomeOffice", "Other"}

    if(conductsBusinessAtInsuredLocation and typeOfBusinessConducted != null and businessTypesToEvaluate.containsIgnoreCase(typeOfBusinessConducted) and homeowner.Dwelling.Occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER){
      return RuleEvaluationResult.execute()
    }else{
      return RuleEvaluationResult.skip()
    }
  }
}