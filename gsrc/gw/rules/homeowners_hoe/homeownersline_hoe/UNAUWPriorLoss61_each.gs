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
class UNAUWPriorLoss61_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Animal Damage - First Party" AND/OR  Expanded Loss Cause = "Animal Damage - Hard Living,
// Rental Property" OR "Animal Damage - Owned by Insured"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_ANIMALDAMAGE1STPARTY && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_ANIMALDAMAGE_HARDLIVINGRENTALPROPERTY
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_ANIMALDAMAGE_OWNEDBYINSURED))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}