package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBP7Rule37_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.BP7LineExists)
      {
        period.BP7Line.BP7Locations.each( \ elt ->
        {
          elt.Buildings.each( \ elt1 ->
          {
            elt1.Classifications.each( \ elt2 ->
            {
              if(DateUtil.addYears(elt1.YearBuilt_Ext,50)<new java.util.Date() &&  elt2.BP7ClassificationBusinessPersonalPropertyExists && elt2.BP7ClassificationBusinessPersonalProperty.HasBP7BusnPrsnlPropLimitTerm
              && elt2.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm.Value.doubleValue()>1000000)
                return RuleEvaluationResult.execute()

            }

            )


          }
          )

        })
      }

 return RuleEvaluationResult.skip()
  }


}