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
class UWQuestionFuelTankAGCAP_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner.Dwelling.HOUWQuestions.propanegas == typekey.HOPropaneNaturalgas_Ext.TC_ABOVEGROUND)
      if(homeowner.Dwelling.HOUWQuestions.fuellocalcode == typekey.HOFuelTankLocalBC_Ext.TC_NO){
        return RuleEvaluationResult.execute()
      }


   return RuleEvaluationResult.skip()
  }


}