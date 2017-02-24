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
class UNAUWPriorLoss27_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount


//Any prior loss with CLUE or Agent Cause of Loss = "Liab", "Dog", or "SLIP" and Date of Loss is in last 5 years




    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      elt.ClaimPayment.each( \ elt1 ->
      {
        if((elt1.LossCause_Ext==typekey.LossCause_Ext.TC_LIAB || elt1.LossCause_Ext==typekey.LossCause_Ext.TC_DOGBITE_LIABILITY || elt1.LossCause_Ext==typekey.LossCause_Ext.TC_SLIPORFALLLIABILITY)
        && DateUtil.addYears(elt.ClaimDate as java.util.Date,5)>new java.util.Date() )
          return RuleEvaluationResult.execute()
      }

      )}
          )

    return RuleEvaluationResult.skip()

}
}