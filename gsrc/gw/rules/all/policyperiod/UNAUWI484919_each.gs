package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 * US4849.19
 */
class UNAUWI484919_each implements IRuleCondition<PolicyPeriod>
{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult
  {

    if(period.PrimaryLocation.State.Code=="FL" && period.PrimaryLocation.County.equalsIgnoreCase("coastal"))
      {
        if(period.CPLineExists)
          {
            period.CPLine.CPLocations.each( \ elt ->
            {
              elt.Buildings.each( \ elt2 ->
              {
                if(elt2.Windpoolvalue_Ext==null)
                  return RuleEvaluationResult.execute()
              }
              )
            })
          }

        if(period.BP7LineExists)
          {
            period.BP7Line.BP7Locations.each( \ elt ->
            {
              elt.Buildings.each( \ elt2 ->
              {
                if(elt2.WindPool_Ext==null)
                  return RuleEvaluationResult.execute()
              } )
            }
            )
          }
        //homeowner?.Dwelling.HOLocation.WindPool_Ext==null)

      }
   return RuleEvaluationResult.skip()
  }


}