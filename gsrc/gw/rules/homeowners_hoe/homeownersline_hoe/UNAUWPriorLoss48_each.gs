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
class


    UNAUWPriorLoss48_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //IF FNOL Loss Cause = "Burglary" AND/OR  Expanded Loss Cause = "Burglary - Occupied Property" OR "Burglary - Unoccupied
    // Property" OR "Burglary - Vacant Property - No Foreclosure" OR "Burglary - Vacant Property - Foreclosure".


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BURGLARY || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BURGLARY_OCCUPIEDPROPERTY
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BURGLARY_UNOCCUPIEDPROPERTY ||
                   elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BURGLARY_VACANTPROPERTYFORECLOSURE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BURGLARYVACANTPROPERTYNOFORECLOSURE)

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}