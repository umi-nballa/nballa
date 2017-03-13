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
class UNAUWBP7Rule57_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {

        period?.BP7Line.BP7Locations.each( \ elt ->
        {
          elt.Buildings.each( \ elt1 ->
          {
             elt1.Classifications.each( \ elt2 ->
                {
                  if(elt2.BP7CondoCommlUnitOwnersOptionalCovMiscRealPropExists &&
                      elt2.BP7CondoCommlUnitOwnersOptionalCovsLossAssessExists &&
                      period.Forms.firstWhere( \ elt3 -> elt3.FormNumber=="BP 17 03")!=null)
                    return RuleEvaluationResult.execute()
                }
             )
          })
        })
           }

    return RuleEvaluationResult.skip()

  }

}