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
class UNAPC10_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//Any policy with a Protection Class 10 (Excluding Protected Subdivision)


    if(homeowner.Dwelling.HOLocation.protectionClassOrOverride==typekey.ProtectionClassCode_Ext.TC_10)
              return RuleEvaluationResult.execute()

    return RuleEvaluationResult.skip()

}
}