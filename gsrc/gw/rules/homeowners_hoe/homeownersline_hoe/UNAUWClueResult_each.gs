package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWClueResult_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    //if(
         homeowner.HOPriorLosses_Ext.each( \ elt ->
         {
           if(elt.OriginLoss==typekey.OriginOfLoss_Ext.TC_CLUE)
             return RuleEvaluationResult.execute()

         })

   return RuleEvaluationResult.skip()
  }


}