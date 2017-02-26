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
class UWDwellingAge50Update_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var dwellingAge = gw.lob.ho.HODwellingUtil_HOE.diffInYears(homeowner.Branch.PeriodStart?.YearOfDate, homeowner.Dwelling?.YearBuilt)
    var roofreplaceYear =  homeowner.Dwelling?.RoofingUpgrade ?  gw.lob.ho.HODwellingUtil_HOE.diffInYears(homeowner.Branch.PeriodStart?.YearOfDate,homeowner.Dwelling?.RoofingUpgradeDate) : 0
    var HeatReplaceYear =  homeowner.Dwelling?.HeatingUpgrade ? gw.lob.ho.HODwellingUtil_HOE.diffInYears(homeowner.Branch.PeriodStart?.YearOfDate,homeowner.Dwelling?.HeatingUpgradeDate)  :0
    var ElectReplaceYear =  homeowner.Dwelling?.ElectricalSystemUpgrade ? gw.lob.ho.HODwellingUtil_HOE.diffInYears(homeowner.Branch.PeriodStart?.YearOfDate,homeowner.Dwelling?.ElectricalSystemUpgradeDate)  :0

    if(dwellingAge > 50  &&  ( roofreplaceYear < 35 || HeatReplaceYear < 35 || ElectReplaceYear < 35 )){
      return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }
}