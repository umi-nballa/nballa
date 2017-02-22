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
class UNAUWWatercraftCov2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.HOSL_OutboardMotorsWatercraft_HOE_ExtExists)
      {
        homeowner.HOSL_OutboardMotorsWatercraft_HOE_Ext.scheduledItem_Ext.each( \ elt -> {
          if(elt.overallLength==typekey.OverallLength_Ext.TC_LESS26FT || elt.overallLength==typekey.OverallLength_Ext.TC_MORE40FT)
            return RuleEvaluationResult.execute()
       })}

   return RuleEvaluationResult.skip()
  }


}