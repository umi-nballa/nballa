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
class UNAProtClassSplitDistFD_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if(homeowner.Dwelling.HOLocation?.DwellingProtectionClassCode!=null &&
        homeowner.Dwelling.HOLocation?.DwellingProtectionClassCode.trim()!="" &&
        homeowner.Dwelling.HOLocation?.DwellingProtectionClassCode?.indexOf("/")!=-1  &&
        homeowner.Dwelling.HOLocation?.DistanceToFireStation!=null &&
        homeowner.Dwelling.HOLocation?.DistanceToFireStation.toString().Numeric
        && homeowner.Dwelling.HOLocation?.DistanceToFireStation>5)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}