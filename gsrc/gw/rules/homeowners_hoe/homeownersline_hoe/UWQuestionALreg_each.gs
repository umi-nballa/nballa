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
class UWQuestionALreg_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult

    var conductsBusinessFromHome = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CONDUCTS_BUSINESS_HO.QuestionCode).BooleanAnswer
    var isChildDaycare = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.TYPE_OF_BUSINESS_HO.QuestionCode).ChoiceAnswer.ChoiceCode == "ChildDaycare"
    var isRegisteredWithDepartmentOfChildrenAndFamilies = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.IS_DAYCARE_REGISTERED_HO.QuestionCode).BooleanAnswer

    if(conductsBusinessFromHome and isChildDaycare and !isRegisteredWithDepartmentOfChildrenAndFamilies){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
  }
}