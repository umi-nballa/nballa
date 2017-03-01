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
class UNAUWPriorLoss46_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Theft" AND/OR Expanded Loss Cause =" Theft From On Premise Auto" OR "Theft From Off  Premise Auto" OR "Theft from Residence Premise - No Foreclosure"
// OR  "Theft from Residence Premise - Foreclosure" OR "Theft From Location Other than Residence Premise."


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_THEFT || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_THEFT_FROMON_PREMISEAUTO
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_THEFT_FROMOFF_PREMISEAUTO ||
                   elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_THEFT_FROMRESIDENCEPREMISE_NOFORECLOSURE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_THEFT_FROMRESIDENCEPREMISE_FORECLOSURE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_THEFT_FROMLOCATIONOTHERTHANRESIDENCEPREMISE)

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}