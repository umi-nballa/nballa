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
class UNAUWPriorLoss67_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Flood" AND/OR  Expanded Loss Cause = "Flood - Excessive Rain Causing Surface Ponding" OR
// "Flood - Surface Ponding from Sewer Obstruction" OR "Flood - River/Lake Overflow" OR "Flood - Storm Surge",


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_FLOOD && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FLOOD_EXCESSIVERAINCAUSINGSURFACEPONDING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FLOOD_SURFACEPONDINGFROMSEWEROBSTRUCTION
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FLOOD_RIVERORLAKEOVERFLOW
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FLOOD_STORMSURGE))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}