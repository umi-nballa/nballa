package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWQuestionALLiability_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner.Dwelling.HOUWQuestions.businessconduct && homeowner.Dwelling.HOUWQuestions.daycare && homeowner.Dwelling.HOUWQuestions.daycareregs )
     if(homeowner.Dwelling.HOUWQuestions.commercialliability){
        return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
}

}