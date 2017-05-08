package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.ActivityUtil
uses gw.accelerator.ruleeng.IRuleAction

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAACT29051062 implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If Product = Homeowners and any transaction bound or issued and TUNA fields -- Year Built Match Level
// or Construction Type Match Level or Roof Type (Shape) Match Level = User Entered by Agent) then create
// activity and assign to the CSR Queue

  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("critical360_data_changed")
    if (period.HomeownersLine_HOEExists && period.Job.Subtype !=typekey.Job.TC_SUBMISSION &&  (period.HomeownersLine_HOE.Dwelling.YearbuiltMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED ||
       period.HomeownersLine_HOE.Dwelling.ConstructionTypeMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED ||
       period.HomeownersLine_HOE.Dwelling.RoofTypeMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED))
    {
      return RuleEvaluationResult.execute()
   }
   return RuleEvaluationResult.skip()
  }


  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("critical360_data_changed")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue("CSR Queue", "Universal Insurance Manager's Inc", activity)
  }
}

