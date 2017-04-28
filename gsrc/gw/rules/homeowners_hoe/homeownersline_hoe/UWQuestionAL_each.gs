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
class UWQuestionAL_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult
    var conductsBusinessFromHome = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CONDUCTS_BUSINESS_HO.QuestionCode).BooleanAnswer
    var doesApplicantOperateDaycarePerFloridaStatute = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.OPERATES_DAYCARE_PER_FLORIDA_STATUTE_HO.QuestionCode).BooleanAnswer


    if(conductsBusinessFromHome and doesApplicantOperateDaycarePerFloridaStatute != null and !doesApplicantOperateDaycarePerFloridaStatute){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
  }
}