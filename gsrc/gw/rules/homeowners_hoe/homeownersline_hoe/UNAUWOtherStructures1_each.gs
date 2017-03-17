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
class UNAUWOtherStructures1_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //Other Structures on the Residence Premises Increased Limit is selected in an amount greater
    // than 70% of Coverage A

    if( homeowner.Dwelling.HODW_OtherStructuresOnPremise_HOEExists)
      {

          homeowner.Dwelling.HODW_OtherStructuresOnPremise_HOE.ScheduledItems.each( \ elt ->
          {
            //if(elt.AdditionalLimit>0.7 * homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value.doubleValue())
            //return RuleEvaluationResult.execute()

          })
      }

   return RuleEvaluationResult.skip()
  }


}