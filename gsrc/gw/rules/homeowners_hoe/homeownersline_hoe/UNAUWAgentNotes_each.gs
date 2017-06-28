package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses org.apache.commons.lang3.StringUtils

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWAgentNotes_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If Exterior Wall Construction = "Concrete Block", "Poured Concrete", "Solid Brick/Stone", "Fire Resistive", "Non Combustible", "Masonry Non Combustible"

    if(homeowner.AssociatedPolicyPeriod.Submission.Notes?.hasMatch( \ elt -> StringUtils.isNotBlank(elt.ProducerCode))) {
      return RuleEvaluationResult.execute()
    }

    return RuleEvaluationResult.skip()

}
}