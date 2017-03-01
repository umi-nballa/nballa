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
class UNAUWPriorLoss68_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//IF FNOL Loss = "Electrical Surge" AND/OR Expanded Loss Cause = "Electrical Surge - Off Premise Cause"
// OR "Electrical Surge - On Premise Cause" OR "Electrical Surge - Lightning".


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_ELECTRICALSURGE && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_ELECTRICALSURGE_OFFPREMISECAUSE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_ELECTRICALSURGE_ONPREMISECAUSE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_ELECTRICALSURGE_LIGHTNING))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}