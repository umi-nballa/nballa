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
class UNAUWPriorLoss62_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Construction" AND/OR  Expanded Loss Cause = "Defective zoning, surveying, grading, siting"
// OR "Defective Design or Specifications" OR "Defective Workmanship, Repairs, Construction, Remodeling"
// OR "Defective Materials"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_CONSTRUCTION && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_DEFECTIVEZONINGSURVEYINGGRADINGSITING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_DEFECTIVEWORKMANSHIPREPAIRSCONSTRUCTIONREMODELING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_DEFECTIVEMATERIALS))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}