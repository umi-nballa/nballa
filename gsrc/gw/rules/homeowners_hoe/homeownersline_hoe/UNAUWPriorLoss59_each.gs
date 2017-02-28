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
class UNAUWPriorLoss59_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Sinkhole" AND/OR  Expanded Loss Cause = "Sinkhole - CGCC" OR "Sinkhole - Pre-SB408 Confirmed" OR
// "Sinkhole - Pre-SB408 Denied" OR "Sinkhole - Pre-SB408 Not Confirmed" OR "Sinkhole - Post-SB408 Confirmed" OR
// "Sinkhole - Post-SB408 Denied" OR "Sinkhole - Post-SB408 Not Confirmed"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_SINK && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_CGCC
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_PRESB408CONFIRMED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_PRESB408DENIED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_PRESB408NOTCONFIRMED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_POSTSB408CONFIRMED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_POSTSB408DENIED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SINKHOLE_POSTSB408NOTCONFIRMED))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}