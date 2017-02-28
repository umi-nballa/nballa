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
class UNAUWPriorLoss57_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

 //IF FNOL Loss Cause  = "Liability - Vehicle" AND/OR  Expanded Loss Cause = "Liability - Golf Cart" OR "Liability - ATV" OR "Liability - Other Vehicle"

    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYVEHICLE && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_LIABILITY_GOLFCART
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_LIABILITY_ATV
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_LIABILITY_OTHERVEHICLE))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}