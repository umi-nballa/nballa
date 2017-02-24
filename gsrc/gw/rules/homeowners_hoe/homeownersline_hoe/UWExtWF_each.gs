package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWExtWF_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   var WF = homeowner.Dwelling.OverrideExteriorWFval_Ext ? homeowner.Dwelling.ExteriorWFvalueOverridden_Ext:  homeowner.Dwelling.ExteriorWallFinish_Ext
   var WF1 =  homeowner.Dwelling.OverrideExteriorWFvalL1_Ext ? homeowner.Dwelling.ExteriorWFvalueOverridL1_Ext : homeowner.Dwelling.ExteriorWallFinishL1_Ext
    var WF2 = homeowner.Dwelling.OverrideExteriorWFvalL2_Ext ? homeowner.Dwelling.ExteriorWFvalueOverridL2_Ext : homeowner.Dwelling.ExteriorWallFinishL2_Ext

    if ( dertermineRule(WF) || dertermineRule(WF1) || dertermineRule(WF2))
    {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


  private function dertermineRule (value : ExteriorWallFinish_Ext ) : boolean {
            if( value != null && value == typekey.ExteriorWallFinish_Ext.TC_ASBESTOS
            || value == typekey.ExteriorWallFinish_Ext.TC_ALUMINUM
            || value == typekey.ExteriorWallFinish_Ext.TC_EFISSYNTHETICSTUCCO
            || value == typekey.ExteriorWallFinish_Ext.TC_TIN
            || value == typekey.ExteriorWallFinish_Ext.TC_WOODSHAKESIDING
            || value == typekey.ExteriorWallFinish_Ext.TC_NONE
            )
              return true
            else
              return false
   }
}