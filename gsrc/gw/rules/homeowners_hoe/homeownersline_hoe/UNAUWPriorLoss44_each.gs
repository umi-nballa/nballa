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
class UNAUWPriorLoss44_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //3 or more claims (UNA claims + CLUE or Agent Entered)  in 5 years, regardless of amount paid, including Equipment Breakdown losses.
    //  1 of these losses must be UNA loss.   We do not want it to re-refer if we reviewed for same losses last year.



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

               if(DateUtil.addYears(elt.ClaimDate as java.util.Date,5)>new java.util.Date() )
               {
                 clmcount++
                 if(elt.Source==typekey.Source_Ext.TC_UNACLAIM)
                   unacount++

               }

             })
           }

         })

    if(clmcount>=3 && unacount>=1)
      return RuleEvaluationResult.execute()

    return RuleEvaluationResult.skip()
  }


}