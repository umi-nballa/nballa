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
class UNAUWPriorLoss49_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //IF FNOL Loss Cause = "Broken Glass" AND the Expanded loss Cause = "Broken Glass - V/MM" OR "Broken Glass -
    // Burglary Attempt".

    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BROKENGLASS && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BROKENGLASS_VORMM
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BROKENGLASS_BURGLARYATTEMPT))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}