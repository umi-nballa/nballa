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
class UNAUWPriorLoss13_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount

    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      if(elt.ClaimStatus.equalsIgnoreCase("open") || elt.ClaimStatus.equalsIgnoreCase("pending") || elt.ClaimStatus.equalsIgnoreCase("unresolved") ||
      (homeowner.AssociatedPolicyPeriod.BaseState.Code=="TX" && elt.ClaimStatus.equalsIgnoreCase("break")))
        return RuleEvaluationResult.execute()
    }
      )

    return RuleEvaluationResult.skip()

}
}