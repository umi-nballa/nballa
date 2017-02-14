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
class UWQuestionMoldRemNo_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
      if(homeowner.Dwelling.HOUWQuestions.moldd){
         if(!homeowner.Dwelling.HOUWQuestions.moldrem)
            return RuleEvaluationResult.execute()
        }
   return RuleEvaluationResult.skip()
   }
}