package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil
uses java.util.Date
uses java.util.ArrayList
uses una.integration.mapping.hpx.helper.HPXRatingHelper

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWTotDevFact_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//Total Deviation Factor > 2.5

    var help = new HPXRatingHelper()
    if(help.getConsentToRateTotalDeviationPercent(homeowner.AssociatedPolicyPeriod)>2.5)
         return RuleEvaluationResult.execute()

    return RuleEvaluationResult.skip()

}
}