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
class UWQuestionBusCov_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    return (shouldExecuteRule(homeowner)) ? RuleEvaluationResult.execute() : RuleEvaluationResult.skip()
  }

  private function shouldExecuteRule(hoLine : HomeownersLine_HOE) : boolean{
    var conductsBusinessCode = typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(hoLine.HOPolicyType) ? DwellingUWQuestionCodes.CONDUCTS_BUSINESS_DF.QuestionCode : DwellingUWQuestionCodes.CONDUCTS_BUSINESS_DF.QuestionCode
    var conductsBusinessFromInsuredLocation = hoLine.Branch.getAnswerForQuestionCode(conductsBusinessCode).BooleanAnswer

    var hasBusinessPolicyCode = typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(hoLine.HOPolicyType) ? DwellingUWQuestionCodes.HAS_BUSINESS_POLICY_DF.QuestionCode : DwellingUWQuestionCodes.HAS_BUSINESS_POLICY_HO.QuestionCode
    var hasBusinessPolicy = hoLine.Branch.getAnswerForQuestionCode(hasBusinessPolicyCode).BooleanAnswer

    var typeOfBusinessCode = typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(hoLine.HOPolicyType) ? DwellingUWQuestionCodes.TYPE_OF_BUSINESS_DF.QuestionCode : DwellingUWQuestionCodes.TYPE_OF_BUSINESS_HO.QuestionCode
    var typeOfBusiness = hoLine.Branch.getAnswerForQuestionCode(typeOfBusinessCode).ChoiceAnswer.ChoiceCode

    return conductsBusinessFromInsuredLocation
       and hoLine.Dwelling.Occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER
       and typeOfBusiness?.equalsIgnoreCase("HomeOffice")
       and hasBusinessPolicy != null and !hasBusinessPolicy
  }

}