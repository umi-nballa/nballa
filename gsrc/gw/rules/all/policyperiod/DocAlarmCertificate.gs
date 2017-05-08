package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocAlarmCertificate implements IRuleCondition<PolicyPeriod>,IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

  if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED  && isDocRequired(period) )
        return RuleEvaluationResult.execute()
    else
        return RuleEvaluationResult.skip()
  }

  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult) {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("protective_device_follow_up")
      var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
      ActivityUtil.assignActivityToQueue("CSR Follow up Queue", "Universal Insurance Manager's Inc", activity)

      var list = new AgentDocList_Ext(target)
      list.DocumentName = "Alarm Certificate or Billing Statement"
      target.addToAgentDocs(list)
  }

  function isDocRequired(period : PolicyPeriod) : boolean{
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


    if(period.BaseState.Code == typekey.State.TC_AZ &&
        (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
      if (FireCntlStation || BurglarCntlStation)  {
        return true
      }
    }else if (period.BaseState.Code == typekey.State.TC_CA){
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation || BurglarCntlStation)  {
           return true
        }

      }else if (
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
        if (FireCntlStation || FireFireStation)  {
          return true
        }
      }
    }else if (period.BaseState.Code == typekey.State.TC_FL){
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation ||BurglarCntlStation || BurglarPolicestn || FireFireStation)  {
          return true
        }

      }else if ( period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
        if (FireCntlStation || BurglarCntlStation)  {
           return true
        }
      }
    }else if (period.BaseState.Code == typekey.State.TC_HI){
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation ||BurglarCntlStation )  {
          return true
        }

      }else if (
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
        if (FireCntlStation )  {
          return true
        }
      }
    }else if (period.BaseState.Code == typekey.State.TC_NV){
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation ||BurglarCntlStation )  {
           return true
        }
      }
    } else if (period.BaseState.Code == typekey.State.TC_NC){
      if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
        if (FireCntlStation ||BurglarCntlStation || FireFireStation || FirePoliceStn)  {
           return true
        }
      }
    }else if(period.BaseState.Code == typekey.State.TC_SC &&
        (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
      if (FireCntlStation || BurglarCntlStation)  {
         return true
      }
    }else if(period.BaseState.Code == typekey.State.TC_TX &&
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

