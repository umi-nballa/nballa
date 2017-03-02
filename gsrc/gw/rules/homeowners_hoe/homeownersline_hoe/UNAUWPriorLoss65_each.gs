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
class UNAUWPriorLoss65_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Pollution" AND/OR   Expanded Loss Cause = "Pollution - Leaking Underground Storage Tank"
// OR "Pollution - Leaking Above-Ground Storage Tank" OR "Pollution - Building Material Off-Gassing, Discharge, Dispersal"
// OR "Pollution - Other".


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_POLLUTION && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_POLLUTION_LEAKINGUNDERGROUNDSTORAGETANK
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_POLLUTION_LEAKINGABOVEGROUNDSTORAGETANK
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_POLLUTION_BLDNGMTRALOFGASSINGDISCHARGEDISPERSAL
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_POLLUTION_OTHER))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}