package gw.rules.all.policyperiod


/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocAlarmCertificate extends DocumentRequestRuleExecution{
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("protective_device_follow_up")
//  var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return period.HomeownersLine_HOEExists
        and period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
        and isDocRequired(period)
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_AlarmCertificate
  }

  function isDocRequired(period: PolicyPeriod): boolean {
    //Fire Alarm Reporting to Central Station
    var FireCntlStation = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.FireAlarmReportCntlStn
    //Burglar Alarm Reporting to Central Station
    var BurglarCntlStation = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.BurglarAlarmReportCntlStn
    //Burglar Alarm Reporting to Police Station
    var BurglarPolicestn = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.BurglarAlarmReportPoliceStn
    //Fire Alarm Reporting to Fire Station
    var FireFireStation = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.FireAlarmReportFireStn
    //Fire Alarm Reporting to Police Station
    var FirePoliceStn = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.FireAlarmReportPoliceStn


    if (period.BaseState.Code == typekey.State.TC_AZ &&
        (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)) {
      if (FireCntlStation || BurglarCntlStation)  {
        return true
      }
    } else if (period.BaseState.Code == typekey.State.TC_CA) {
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation || BurglarCntlStation)  {
          return true
        }
      } else if (
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
        if (FireCntlStation || FireFireStation)  {
          return true
        }
      }
    } else if (period.BaseState.Code == typekey.State.TC_FL) {
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation || BurglarCntlStation || BurglarPolicestn || FireFireStation)  {
          return true
        }
      } else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
        if (FireCntlStation || BurglarCntlStation)  {
          return true
        }
      }
    } else if (period.BaseState.Code == typekey.State.TC_HI) {
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation || BurglarCntlStation)  {
          return true
        }
      } else if (
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
        if (FireCntlStation)  {
          return true
        }
      }
    } else if (period.BaseState.Code == typekey.State.TC_NV) {
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation || BurglarCntlStation)  {
          return true
        }
      }
    } else if (period.BaseState.Code == typekey.State.TC_NC) {
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation || BurglarCntlStation || FireFireStation || FirePoliceStn)  {
          return true
        }
      }
    } else if (period.BaseState.Code == typekey.State.TC_SC &&
        (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)) {
      if (FireCntlStation || BurglarCntlStation)  {
        return true
      }
    } else if (period.BaseState.Code == typekey.State.TC_TX &&
        (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOA_EXT ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOB_EXT ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT)){
      if (FireCntlStation || BurglarCntlStation)  {
        return true
      }
    }
    return false
  }
}

