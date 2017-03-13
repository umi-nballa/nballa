package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBP7Rule55_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {
        var min = 0
        var max = 0
        period?.BP7Line.Modifiers.each( \ elt ->
        {
          min+=elt.Minimum.doubleValue()
          max+=elt.Maximum.doubleValue()
        })

        if(min<0.75 || max>1.25)

                 return RuleEvaluationResult.execute()

            }

    return RuleEvaluationResult.skip()

  }

}