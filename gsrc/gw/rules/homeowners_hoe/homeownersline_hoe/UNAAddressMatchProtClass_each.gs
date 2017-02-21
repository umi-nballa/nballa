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
class UNAAddressMatchProtClass_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(typekey.ProtectionClassCode_Ext.TF_UWISSUEFILTER1.TypeKeys.contains(homeowner?.Dwelling.HOLocation.DwellingProtectionClassCode)
    && homeowner.AssociatedPolicyPeriod.PolicyLocations.firstWhere( \ elt -> elt.AccountLocation.addressScrub_Ext)!=null
    && homeowner.Dwelling.HOLocation.DistanceToFireStation>5)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}