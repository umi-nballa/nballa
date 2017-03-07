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
class UNAUWPriorLoss64_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
//If FNOL Loss Cause = "Biohazard" AND/OR  Expanded Loss Cause = "Biohazard - Suicide" OR "Biohazard - Criminal;
// Death/Injury" OR "Biohazard - Natural Death" OR "Biohazard - Animal Hoarding" OR "Biohazard - Infectious Disease"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BIOHAZARD && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BIOHAZARD_SUICIDE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BIOHAZARD_CRIMINALORDEATHORINJURY
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BIOHAZARD_NATURALDEATH
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BIOHAZARD_ANIMALHOARDING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_BIOHAZARD_INFECTIOUSDISEASE))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}