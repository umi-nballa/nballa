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
class UWQuestionMixOfBreedTenant_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult

    var tenantOwnsAggressiveDogs = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.OWNS_AGGRESSIVE_DOG_DF.QuestionCode).BooleanAnswer

    if (tenantOwnsAggressiveDogs and homeowner.Dwelling.Occupancy != typekey.DwellingOccupancyType_HOE.TC_OWNER ){
      result =  RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
   }
}