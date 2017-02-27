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
class UWDUseOccAll_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(((homeowner.Dwelling.DwellingUsage == DwellingUsage_HOE.TC_PRIM ||
        homeowner.Dwelling.DwellingUsage == DwellingUsage_HOE.TC_SEC ) &&
        (homeowner.Dwelling.Occupancy ==	DwellingOccupancyType_HOE.TC_VACANT ||
        homeowner.Dwelling.Occupancy ==	DwellingOccupancyType_HOE.TC_INCONST)) ||
        homeowner.Dwelling.DwellingUsage == DwellingUsage_HOE.TC_SEC && homeowner.Dwelling.Occupancy ==	DwellingOccupancyType_HOE.TC_OWNER ){

        return RuleEvaluationResult.execute()
      }

   return RuleEvaluationResult.skip()
  }


}