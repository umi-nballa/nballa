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
class UNAUWBP7Rule22_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //So if the Building Owner occupies either <65% or >65% it is a Lessor's risk. If the Building Owner Occupies a 100% then you need to use it for the Occupant.

    if(period.BP7LineExists)
      {
        period.BP7Line.BP7Locations.each( \ elt ->
        {
          elt.Buildings.each( \ elt1 ->
          {
            if(elt1.BP7StructureExists && elt1.BP7Structure.HasBP7BuildingOwnerOccupies_EXTTerm && elt1.BP7Structure.BP7BuildingOwnerOccupies_EXTTerm?.OptionValue?.Value?.doubleValue()!=100
                && period.Forms.firstWhere(  \ elt2 -> elt2.FormNumber=="BP 01 67")!=null)
              return RuleEvaluationResult.execute()

          }
          )
        })
      }

    return RuleEvaluationResult.skip()

  }

}