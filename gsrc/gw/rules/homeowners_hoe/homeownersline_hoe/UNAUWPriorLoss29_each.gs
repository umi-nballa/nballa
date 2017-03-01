package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil
uses java.util.Date
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWPriorLoss29_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount

    //Any application with 1 weather loss and 1 non weather loss in last 3 years.   Exclude "Break" in all states besides TX.


    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      elt.ClaimPayment.each( \ elt1 ->
      {
        if((typekey.LossCause_Ext.TF_NONWEATHERUW2.TypeKeys.contains(elt1.LossCause_Ext))
            && (elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BROKENGLASS || (homeowner.AssociatedPolicyPeriod.BaseState.Code=="TX" && elt1.LossCause_Ext==typekey.LossCause_Ext.TC_BROKENGLASS))
            && elt.ClaimDate!=null && DateUtil.addYears(elt.ClaimDate as Date, 3)<new java.util.Date())
          return RuleEvaluationResult.execute()
      }
      )
    }
    )


    return RuleEvaluationResult.skip()

}
}