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
class UWQuestionRoofAge25_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
   if((typekey.RoofType.TF_COMPROOFTYPES.TypeKeys.contains(homeowner.Dwelling.RoofingMaterialOverridden_Ext)  ||
        typekey.RoofType.TF_COMPROOFTYPES.TypeKeys.contains(homeowner.Dwelling.RoofType)) &&
        (homeowner.Dwelling.RoofingUpgradeDate != null &&
            homeowner.Dwelling.RoofingUpgradeDate.compareTo(gw.api.util.DateUtil.getYear(gw.api.util.DateUtil.currentDate())) > 25) ) {
        return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
  }
}