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
class UNAUWBP7Rule47_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If Predominent Occupancy Type = Service, Retail or Distributor and Spoilage Coverage Limit > 0

    if(period.BP7LineExists)  {
      period.BP7Line.BP7Locations.each( \ elt ->
      {
        elt.Buildings.each( \ elt1 ->
        {
          elt1.Classifications.each( \ elt2 ->
          {
            if((elt2.ClassPropertyType==typekey.BP7ClassificationPropertyType.TC_RETAIL ||
                elt2.ClassPropertyType==typekey.BP7ClassificationPropertyType.TC_DISTRIBUTOR ||
                elt2.ClassPropertyType==typekey.BP7ClassificationPropertyType.TC_SERVICE)
             && elt2.BP7SpoilgCovExists && elt2.BP7SpoilgCov.HasBP7Limit32Term && elt2.BP7SpoilgCov.BP7Limit32Term.Value.doubleValue()>0)
              return RuleEvaluationResult.execute()

          })

        })
      })
    }

 return RuleEvaluationResult.skip()
  }
  }


