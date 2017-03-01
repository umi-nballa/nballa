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
class UNAUWPriorLoss56_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Liability - Pool Injury" OR "Liability - Trampoline Injury"  OR "Liability - Slip/Fall/Trip" OR "Liability - Off Premise" OR
// "Liability - Personal Injury" OR "Liability - Advertising Injury" OR "Liability - Professional Liability"  OR "Liability - Loss Assessment" OR
// "Liability - Mold" OR "Liability - Water Craft" OR "Liability - All Other" OR "Liability - Damage to 3rd Party Property"



    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYPOOLINJURY || elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYTRAMPOLINEINJURY ||
                   elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYSLIPORFALLORTRIP || elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYOFFPREMISE ||
                   elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYPERSONALINJURY || elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYADVERTISINGINJURY ||
                   elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYPROFESSIONALLIABILITY || elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYLOSSASSESSMENT ||
                   elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYMOLD || elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYWATERCRAFT ||
               elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITY_ALLOTHER || elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYDAMAGETO3RDPARTY )

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}