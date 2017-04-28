package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.UNAProductModelUtil.DwellingUWQuestionCodes

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWAnimalLiabilityLim_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult

    if( homeowner.HOLI_AnimalLiabilityCov_HOE_ExtExists and homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.OWNS_AGGRESSIVE_DOG_HO.QuestionCode).BooleanAnswer){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
  }


}