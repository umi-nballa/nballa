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
class UNAUWPriorLoss41_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //2 or more losses (UNA Claims + CLUE or Agent Entered) in last 3 years, regardless of amount paid,
    // excluding Equipment Breakdown losses.   1 of thes losses must be a UNA loss.
    // We do not want it to refer if we reviewed for same causes of loss last year.


    var clmcount = 0
    var unacount = 0
    //if(
         homeowner.HOPriorLosses_Ext.each( \ elt ->
         {
           if(elt.OriginLoss==typekey.OriginOfLoss_Ext.TC_AGENT || homeowner.ClueHit_Ext)
             //return RuleEvaluationResult.execute()
           {
             elt.ClaimPayment.each( \ elt1 ->
             {

               if((elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_EQBRK)
                   && DateUtil.addYears(elt.ClaimDate as java.util.Date,3)>new java.util.Date() )
               {
                 clmcount++
                 if(elt.Source_Ext==typekey.Source_Ext.TC_UNACLAIM)
                   unacount++

               }

             })
           }

         })

    if(clmcount>=2 && unacount>=1)
      return RuleEvaluationResult.execute()

    return RuleEvaluationResult.skip()
  }


}