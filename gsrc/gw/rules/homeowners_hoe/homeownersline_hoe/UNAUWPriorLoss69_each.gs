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
class UNAUWPriorLoss69_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause  = Tree Damage" AND/OR Expanded Loss Cuase = "Tree Damage - Insured's Tree, Not Caused by Wind"
// OR "Tree Damage - Neighbor's Tree, Not Caused by Wind"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_TREEDAMAGETOPROPERTY && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_TREEDAMAGE_INSUREDTREENOTCAUSEDBYWIND
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_TREEDAMAGE_NEIGHBORTREENOTCAUSEDBYWIND))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}