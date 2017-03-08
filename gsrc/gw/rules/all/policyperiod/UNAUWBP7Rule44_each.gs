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
class UNAUWBP7Rule44_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //If Agency Number is 86214 - Coastal Insurance Underwriters


    if(period.BP7LineExists)
      {
        period.BP7Line.BP7Locations.each( \ elt ->
        {
          elt.Buildings.each( \ elt1 ->
          {
            if(period.ProducerOfRecord.AgenyNumber_Ext.indexOf("86214")!=-1 &&
                period.ProducerOfRecord.Name=="Coastal Insurance Underwriters")
              return RuleEvaluationResult.execute()

          }
          )

        })
      }

 return RuleEvaluationResult.skip()
  }


}