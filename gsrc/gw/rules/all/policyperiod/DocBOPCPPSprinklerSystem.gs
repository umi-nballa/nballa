package gw.rules.all.policyperiod


/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocBOPCPPSprinklerSystem extends DocumentRequestRuleExecution{
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOPCRP_sprinkler_insp_required")
//  var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return period.Status == typekey.PolicyPeriodStatus.TC_QUOTED and
          (period.BP7LineExists and period.BP7Line.BP7Locations*.Buildings.hasMatch( \ building -> building.Sprinklered))
       or (period.CPLineExists and period.CPLine.CPLocations*.Buildings.hasMatch( \ building -> building.AutomaticFireSuppress))
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_SprinklerInspection
  }
}

