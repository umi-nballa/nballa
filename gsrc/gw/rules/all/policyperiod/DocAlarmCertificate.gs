
package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocAlarmCertificate implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

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

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("uw_period_30")
//protective_device_follow_up
         //period.Status == Quoted

    if (period.HomeownersLine_HOEExists){
          if(period.BaseState.Code == typekey.State.TC_AZ &&
              (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
             if (FireCntlStation || BurglarCntlStation)  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Alarm Certificate or Billing Statement"
               period.addToAgentDocs(list)
             }
          }else if (period.BaseState.Code == typekey.State.TC_CA){
                if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                  if (FireCntlStation || BurglarCntlStation)  {
                    var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                    var list = new AgentDocList_Ext(period)
                    list.DocumentName = "Alarm Certificate or Billing Statement"
                    period.addToAgentDocs(list)
                  }

                }else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                  if (FireCntlStation || FireFireStation)  {
                    //Create Activity
                    var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                    var list = new AgentDocList_Ext(period)
                    list.DocumentName = "Alarm Certificate or Billing Statement"
                    period.addToAgentDocs(list)
                  }
                }
          }else if (period.BaseState.Code == typekey.State.TC_FL){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                if (FireCntlStation ||BurglarCntlStation || BurglarPolicestn || FireFireStation)  {
                  //Create Activity
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Alarm Certificate or Billing Statement"
                  period.addToAgentDocs(list)
                  var activity =  activityPattern.createJobActivity(gw.transaction.Transaction.getCurrent(), period.Job, "Protective Device Follow Up", "Protective Device Follow Up", null, null, null, null, null)
                }

              }else if ( period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                if (FireCntlStation || BurglarCntlStation)  {
                  //Create Activity
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Alarm Certificate or Billing Statement"
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  period.addToAgentDocs(list)
                }
              }
          }else if (period.BaseState.Code == typekey.State.TC_HI){
            if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
              if (FireCntlStation ||BurglarCntlStation )  {
                //Create Activity
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Alarm Certificate or Billing Statement"
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                period.addToAgentDocs(list)
              }

            }else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
              if (FireCntlStation )  {
                //Create Activity
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Alarm Certificate or Billing Statement"
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                period.addToAgentDocs(list)
              }
            }
            }else if (period.BaseState.Code == typekey.State.TC_NV){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                if (FireCntlStation ||BurglarCntlStation )  {
                  //Create Activity
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Alarm Certificate or Billing Statement"
                  period.addToAgentDocs(list)
                }
              }
            } else if (period.BaseState.Code == typekey.State.TC_NC){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                if (FireCntlStation ||BurglarCntlStation || FireFireStation || FirePoliceStn)  {
                  //Create Activity
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Alarm Certificate or Billing Statement"
                  period.addToAgentDocs(list)
                }
              }
            }else if(period.BaseState.Code == typekey.State.TC_SC &&
                (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
              if (FireCntlStation || BurglarCntlStation)  {
                //Create Activity
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Alarm Certificate or Billing Statement"
                period.addToAgentDocs(list)
              }
            }else if(period.BaseState.Code == typekey.State.TC_TX &&
                (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOA_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOB_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT)){
              if (FireCntlStation || BurglarCntlStation)  {
                //Create Activity
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Alarm Certificate or Billing Statement"
                period.addToAgentDocs(list)
              }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

