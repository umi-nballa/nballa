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
class UNAAddressDiscrepancy_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //Address Discrepancy-DP/LPP:query for mailing matching the location address (exclude CA DP where owner occupied
    // is allowed and any policy where the  address verification field checked). HO:query for mailing address different
    // than location address (Exclude secondary/seasonal, HO 17 33, HO 380 and address verification field marked)



    if(homeowner.Dwelling.HODW_DifferenceConditions_HOE_ExtExists  )
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}