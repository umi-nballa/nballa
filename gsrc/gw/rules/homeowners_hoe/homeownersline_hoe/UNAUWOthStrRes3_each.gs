package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWOthStrRes3_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   if( homeowner.Dwelling.HODW_OtherStructuresOnPremise_HOEExists)
      {
        homeowner.Dwelling.HODW_OtherStructuresOnPremise_HOE.ScheduledItems.each( \ elt ->
        {
          if(Double.parseDouble(elt.AdditionalLimit.Value.toString())>0.2*Double.parseDouble(homeowner.Dwelling.CoverageALimitValue_Ext))
              return RuleEvaluationResult.execute()


        })
      }


   return RuleEvaluationResult.skip()
  }


}