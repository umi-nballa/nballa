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
class UNAUWWatercraftCov5_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

      //Question - how to find out if this boat is out of state

    if( homeowner.HOSL_OutboardMotorsWatercraft_HOE_ExtExists)
      {
        homeowner.HOSL_OutboardMotorsWatercraft_HOE_Ext.scheduledItem_Ext.each( \ elt -> {
          if(elt.watercraftType==typekey.WatercraftType_Ext.TC_MOTORBOAT)
            return RuleEvaluationResult.execute()
       })}

   return RuleEvaluationResult.skip()
  }


}