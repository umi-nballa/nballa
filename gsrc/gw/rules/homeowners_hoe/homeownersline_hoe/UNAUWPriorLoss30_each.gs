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
class UNAUWPriorLoss30_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount

    //Any application with CLUE or Agent Cause of Loss, other than "BREAK" with payout between $10,000 and $24,999.  In TX, include "BREAK"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      elt.ClaimPayment.each( \ elt1 ->
      {
        if((elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BROKENGLASS || (homeowner.AssociatedPolicyPeriod.BaseState.Code=="TX" && elt1.LossCause_Ext==typekey.LossCause_Ext.TC_BROKENGLASS)
        && elt1.ClaimAmount>=10000 && elt1.ClaimAmount<=24999)

        )
          return RuleEvaluationResult.execute()
      }

      )}
          )

    return RuleEvaluationResult.skip()

}
}