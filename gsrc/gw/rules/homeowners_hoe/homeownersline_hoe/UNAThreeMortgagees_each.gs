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
class UNAThreeMortgagees_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    homeowner.Dwelling.AdditionalInterests.each( \ elt ->
    {
      if(elt.AdditionalInterestType==typekey.AdditionalInterestType.TC_THIRDMORTGAGEE_EXT)
        return RuleEvaluationResult.execute()
    }
    )




    return RuleEvaluationResult.skip()

}
}