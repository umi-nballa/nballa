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
class UNAUWPriorLoss54_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //If FNOL Loss Cause = "Explosion" AND/OR  Expanded Loss Cause = "Explosion - On-premise gas source, interior appliance" OR "Explosion - On-premise gas source, exterior appliance (grill)"
    // OR "Explosion - On-premise petroleum source (gasoline, etc.)" OR "Explosion - Off-premise source".



    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_EXPLOSION && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_EXPLOSION_ON_PREMISEGASSOURCEINTERIORAPPLIANCE_
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_EXPLOSION_ON_PREMISEGASSOURCEEXTERIORAPPLIANCE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_EXPLOSION_ON_PREMISEPETROLEUMSOURCE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_EXPLOSION_OFF_PREMISESOURCE))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}