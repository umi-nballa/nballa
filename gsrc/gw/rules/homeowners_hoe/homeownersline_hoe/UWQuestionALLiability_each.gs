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
class UWQuestionALLiability_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult
    var conductsBusinessFromHome = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CONDUCTS_BUSINESS_HO.QuestionCode).BooleanAnswer
    var isChildDaycare = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_HO.QuestionCode).ChoiceAnswer.ChoiceCode == "ChildDaycare"
    var hasCommercialLiabilityForDaycare = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.HAS_COMMERCIAL_LIABILITY_INS_HO.QuestionCode).BooleanAnswer

    if(conductsBusinessFromHome and isChildDaycare and !hasCommercialLiabilityForDaycare){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
}

}