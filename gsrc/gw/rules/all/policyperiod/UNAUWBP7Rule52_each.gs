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
class UNAUWBP7Rule52_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If Predominent Occupancy Type = Service, Retail or Distributor and Spoilage Coverage Limit > 0

    if(period.BP7LineExists)  {
      period.BP7Line.BP7Locations.each( \ elt ->
      {
        elt.Buildings.each( \ elt1 ->
        {
          if(elt1.Sprinklered)

              return RuleEvaluationResult.execute()


        })
      })
    }

 return RuleEvaluationResult.skip()
  }
  }


