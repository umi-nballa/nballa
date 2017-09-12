package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/8/17
 * Time: 6:02 PM
 * To change this template use File | Settings | File Templates.
 */
class UNATunaReturnActivity_each implements IRuleCondition<HomeownersLine_HOE> {

  override function evaluateRuleCriteria(holine : HomeownersLine_HOE) : RuleEvaluationResult {



    return RuleEvaluationResult.skip()

  }

}