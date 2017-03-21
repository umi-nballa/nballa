
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
class UNAACT29051062 implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

//If Product = Homeowners and any transaction bound or issued and TUNA fields -- Year Built Match Level
// or Construction Type Match Level or Roof Type (Shape) Match Level = User Entered by Agent) then create
// activity and assign to the CSR Queue


    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("critical360_data_changed")
    if (period.HomeownersLine_HOEExists &&   (period.HomeownersLine_HOE.Dwelling.YearbuiltMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED ||
     period.HomeownersLine_HOE.Dwelling.ConstructionTypeMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED ||
    period.HomeownersLine_HOE.Dwelling.RoofTypeMatchLevel_Ext==typekey.TUNAMatchLevel_Ext.TC_USERSELECTED

    ))
    {
        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
    //    var queueho:AssignableQueue = AssignableQueue.finder.findVisibleQueuesForUser(User.util.CurrentUser).firstWhere( \ elt -> elt.DisplayName=="CSR Queue") as AssignableQueue
     //   activity.assignToQueue(queueho)//)assignActivityToQueue(Group.finder.findByPublicId("CL UW Queue").AssignableQueues.first(),Group.finder.findByPublicId("CL UW Queue"))
   }
   return RuleEvaluationResult.skip()
  }

}

