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
class UWQuestionVacant_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var willBeUnderConstruction : boolean

    if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(homeowner.HOPolicyType)){
      willBeUnderConstruction = (homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.WILL_BE_UNDER_CONSTRUCTION_DF.QuestionCode).BooleanAnswer)
    }else{
      willBeUnderConstruction = (homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.WILL_BE_UNDER_CONSTRUCTION_HO.QuestionCode).BooleanAnswer)
    }

    return (willBeUnderConstruction) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }
}