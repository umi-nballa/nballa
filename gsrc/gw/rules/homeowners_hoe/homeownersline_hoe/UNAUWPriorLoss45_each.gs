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
class UNAUWPriorLoss45_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // If  FNOL Loss Cause  = "Mysterious Disappearance" AND/OR  Expanded Loss Cause = "Scheduled Personal Property - Lost
   // (Mysterious Disappearance)" OR "Scheduled Personal Property - Damaged", OR "Scheduled Personal Property - Theft"

         homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_DISAP || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SCHEDULEDPERSONALPROPERTY_LOST
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SCHEDULEDPERSONALPROPERTY_THEFT ||
                   elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SCHEDULEDPERSONALPROPERTYDAMAGED)

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}