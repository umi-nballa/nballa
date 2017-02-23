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
class UNAUWNoWindPoolWindCov_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    if(homeowner.Dwelling.HOLocation.WindPool_Ext==null && homeowner.Dwelling.HOLocation.WindPoolOverridden_Ext==null &&
    homeowner.HODW_WindHurricaneHailExc_HOE_ExtExists)
    {
        return RuleEvaluationResult.execute()
    }

    return RuleEvaluationResult.skip()

}
}