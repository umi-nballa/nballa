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
class UNAUWPriorLoss53_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //If FNOL Loss Cause = "Smoke Damage"  AND/OR  Expanded Loss Cause = "Smoke Damage - Other Source" OR "Smoke Damage - Furnace/Blow-Back/Fireplace/Heater"
    // OR "Smoke Damage - Smudge Pot Operation" OR "Smoke Damage - Industrial Operations"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_SMOKEDAMAGE && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SMOKEDAMAGE_FURNACEBLOW_BACKFIREPLACEHEATER
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SMOKEDAMAGE_SMUDGEPOTOPERATION
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_SMOKEDAMAGE_INDUSTRIALOPERATIONS))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}