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
class UNAUWPriorLoss1_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount

   if( homeowner.HOPriorLosses_Ext.hasMatch( \ elt ->
    {
        return elt.ClaimPayment.hasMatch( \ elt1 ->
        {
          if(elt1.LossCause_Ext == typekey.LossCause_Ext.TC_EXTEN && DateUtil.addYears(elt.ClaimDate, 5)>new java.util.Date())  {
              return true
            }
          else{
              return false
          }
        })
    }) ){
     return RuleEvaluationResult.execute()
   } else{
     return RuleEvaluationResult.skip()
   }



}
}