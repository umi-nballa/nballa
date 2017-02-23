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
class UNAUWInsScoreClue2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount
//InScore <626 and 1 prior weather loss (CLUE Cause of loss =  "Flood", "Freez", "Hail", "LAE", "Light", "Earthmovement", "Earthquake", "Sinkhole", "Weath", "Wind"

    if(homeowner.AssociatedPolicyPeriod?.CreditInfoExt?.CreditReport?.CreditScore<626)
      {
        homeowner.HOPriorLosses_Ext.each( \ elt ->
        {
          elt.ClaimPayment.each( \ elt1 ->
          {
            if( typekey.LossCause_Ext.TF_WEATHERUW.TypeKeys.contains(elt1.LossCause_Ext) )
              return RuleEvaluationResult.execute()
          }
          )
        }
        )
      }

    return RuleEvaluationResult.skip()

}
}