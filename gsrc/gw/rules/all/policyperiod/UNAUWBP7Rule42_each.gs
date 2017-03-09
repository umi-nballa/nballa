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
class UNAUWBP7Rule42_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {
        period.BP7Line.BP7Locations.each( \ elt ->
        {
          elt.Buildings.each( \ elt1 ->
          {
            if(elt1.BP7StructureExists && elt1.BP7Structure.HasBP7BuildingLimitTerm
            && elt1.BP7Structure.BP7BuildingLimitTerm.Value.doubleValue()>10000000)
              return RuleEvaluationResult.execute()

          }
          )

        })
      }

 return RuleEvaluationResult.skip()
  }


}