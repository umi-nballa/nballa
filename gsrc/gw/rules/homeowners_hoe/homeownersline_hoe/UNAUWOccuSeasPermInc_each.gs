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
class UNAUWOccuSeasPermInc_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if((homeowner.HOPolicyType==typekey.HOPolicyType_HOE.TC_HO3 ||
            homeowner.HOPolicyType==typekey.HOPolicyType_HOE.TC_HO4 ||
        homeowner.HOPolicyType==typekey.HOPolicyType_HOE.TC_HO6) &&
        (homeowner?.Dwelling.Occupancy==typekey.DwellingOccupancyType_HOE.TC_SEASONALRES ||
        homeowner?.Dwelling.Occupancy==typekey.DwellingOccupancyType_HOE.TC_SECONDARYRES)&&
    homeowner.Dwelling.HODW_PermittedIncOcp_HOE_ExtExists)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}