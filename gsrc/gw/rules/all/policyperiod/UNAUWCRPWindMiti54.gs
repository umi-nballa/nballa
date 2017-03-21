package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 3/1/17
 * Time: 8:35 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPWindMiti54 implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)  {
      period.CPLine.CPLocations.each( \ elt ->
      {
          elt.Buildings.each( \ elt1 ->
          {
            if(elt1?.windmitidate!=null && DateUtil.addMonths(elt1?.windmitidate,54)<new java.util.Date())
              return RuleEvaluationResult.execute()

          })
      })
    }
    return RuleEvaluationResult.skip()
  }
}