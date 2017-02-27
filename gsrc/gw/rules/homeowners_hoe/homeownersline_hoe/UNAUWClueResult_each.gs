package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil

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
           if(elt.OriginLoss==typekey.OriginOfLoss_Ext.TC_AGENT || homeowner.ClueHit_Ext)
             //return RuleEvaluationResult.execute()
           {
             elt.ClaimPayment.each( \ elt1 ->
             {
               if((elt1.LossCause_Ext==typekey.LossCause_Ext.TC_FLOOD)
                   && DateUtil.addYears(elt.ClaimDate as java.util.Date,5)>new java.util.Date() )
                 return RuleEvaluationResult.execute()
             })
           }

         })

    return RuleEvaluationResult.skip()
  }


}