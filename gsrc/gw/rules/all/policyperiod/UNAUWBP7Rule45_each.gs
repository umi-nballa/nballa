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
class UNAUWBP7Rule45_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //If Agency Number is 86214 - Coastal Insurance Underwriters

    var count=0

    if(period.BP7LineExists)
      {
        period.NamedInsureds.each( \ elt ->
        {
          if(elt!=period.PrimaryNamedInsured)
              count++


         } )

         }
    if(count==0)
      return RuleEvaluationResult.execute()

 return RuleEvaluationResult.skip()
  }
  }


