package gw.rules.all.policyperiod

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocConsenttoRate  extends DocumentRequestRuleExecution{
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("consent_to_rate_follow_up")
//  var activity = activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return period.HomeownersLine_HOEExists
        and period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
        and period.ConsentToRate_Ext
        and !period.ConsentToRateReceived_Ext
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_PLConsentToRate
  }
}

