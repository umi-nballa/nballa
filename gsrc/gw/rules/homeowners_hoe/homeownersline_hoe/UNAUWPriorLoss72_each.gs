package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil
uses java.util.Date
uses java.util.ArrayList

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWPriorLoss72_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount

//Any application with  2 or more losses with > $0 paid out in last 5 years with same or similar CLUE COL
// Type (See tab "Same/Similar Loss Types").  Do not include "BREAK".

    var arra:ArrayList<typekey.LossCause_Ext>= new ArrayList<typekey.LossCause_Ext>()
    var numloss = 0

    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      if(elt?.ClaimStatus!=typekey.Status_Ext.TC_BREAK)
        {
      var similar:boolean = false
      elt.ClaimPayment.each( \ elt1 ->
      {

        if( elt.ClaimDate!=null && DateUtil.addYears(elt.ClaimDate as Date, 5)<new java.util.Date())
        {
          numloss++
        }
        arra.add(elt1.LossCause_Ext)//!=typekey.LossCause_Ext.)

      }
      )
    }

    }
    )
    var set : java.util.Set<typekey.LossCause_Ext>  = new java.util.HashSet<typekey.LossCause_Ext>(arra)
    if(arra.size()>set.size() && numloss>=2)
         return RuleEvaluationResult.execute()

           //(typekey.LossCause_Ext.TF_NONWEATHERUW2.TypeKeys.contains(elt1.LossCause_Ext))
    //&& (elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BROKENGLASS || (homeowner.AssociatedPolicyPeriod.BaseState.Code=="TX" && elt1.LossCause_Ext==typekey.LossCause_Ext.TC_BROKENGLASS))
    //&&

    return RuleEvaluationResult.skip()

}
}