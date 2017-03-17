package gw.rules.cp.cplocations

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCPRule1_each implements IRuleCondition<CPLocation>{
  override function evaluateRuleCriteria(location : CPLocation) : RuleEvaluationResult {

   // if(period.CPLineExists)
   //   {
   //     period.CPLine.CPLocations.each( \ elt ->
   //     {
          if(location.Location.County.equalsIgnoreCase("Hernando"))
            return RuleEvaluationResult.execute()
   //     })
   //   }



   return RuleEvaluationResult.skip()
  }


}