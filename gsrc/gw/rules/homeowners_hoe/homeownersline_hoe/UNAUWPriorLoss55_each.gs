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
class UNAUWPriorLoss55_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Liability - Animal" AND/OR   Expanded Loss Cause = "Liability - Animal, Insured Owned" OR "Liability - Animal, Tenant Owned"



    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_LIABILITYANIMAL && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_LIABILITY_ANIMALINSUREDOWNED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_LIABILITY_ANIMALTENANTOWNED))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}