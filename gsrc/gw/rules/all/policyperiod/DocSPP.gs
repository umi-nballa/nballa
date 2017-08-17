package gw.rules.all.policyperiod


/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocSPP extends DocumentRequestRuleExecution{
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("appraisal_for_spp_followup")
//  var activity = activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    //TODO tlv refactor logic when CR comes in
    var TotalCovAmount = 0
    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
      for ( item in period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE?.ScheduledItems){
        TotalCovAmount += item.ExposureValue
      }
      if (period.BaseState.Code == typekey.State.TC_AZ)  {
        if (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOEExists &&
            (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ExposureValue > 2000).Count > 0  ||
                TotalCovAmount > 5000  ))  {
          return true
        }
      }else {
        if (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOEExists &&
            (period.HomeownersLine_HOE.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.where( \ elt -> elt.ExposureValue > 5000 || elt.ExposureValue < 9999).Count > 0  ||
                TotalCovAmount > 5000  ))  {
          return true

        }
      }
    }
    return false
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_ScheduledPersonalPropertyAppraisals
  }
}

