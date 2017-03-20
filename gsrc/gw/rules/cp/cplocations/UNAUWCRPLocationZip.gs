package gw.rules.cp.cplocations

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 7:22 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPLocationZip implements IRuleCondition<CPLocation> {

  override function evaluateRuleCriteria(location : CPLocation) : RuleEvaluationResult {

    //if(period.CPLineExists)
    //{
      //period.CPLine.CPLocations.each( \ elt ->
      //{
        if(location.Location.PostalCode=="32563")//if(elt.Location.PostalCode.equals("32563") )
          return RuleEvaluationResult.execute()
      //})
    //}
    return RuleEvaluationResult.skip()
  }
}