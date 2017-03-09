
package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.SprinklerUtil
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocHOSprinklerCerti implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    //Complete Home Sprinkler System - All Areas
    var CompleteSprinkler = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.SprinklerSystemAllAreas
    //Automatic Sprinkler System - Designated Areas Only
    var AutoSprinkler = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.AutomaticSprinkler

    //year built
    var yearBuilt =  period.HomeownersLine_HOE?.dwelling.OverrideYearbuilt_Ext ? period.HomeownersLine_HOE?.dwelling.YearBuiltOverridden_Ext : period.HomeownersLine_HOE?.dwelling.Yearbuilt
    // Square feet
    var sqft = period.HomeownersLine_HOE?.dwelling.OverrideTotalSqFtVal_Ext ? period.HomeownersLine_HOE?.dwelling.TotalSqFtValOverridden_Ext : period.HomeownersLine_HOE?.dwelling.SquareFootage_Ext

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("sprinkler_doc_followup")
    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if((period.BaseState.Code == typekey.State.TC_AZ ) &&
              (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
             if (CompleteSprinkler)  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Sprinkler Certificate"
               period.addToAgentDocs(list)
             }
          }else if (period.BaseState.Code == typekey.State.TC_CA &&
              SprinklerUtil.getSprinklerCredit(period.HomeownersLine_HOE?.Dwelling.HOLocation.PolicyLocation.County ,
                  period.HomeownersLine_HOE?.Dwelling.HOLocation.PolicyLocation.City, yearBuilt.intValue() , Integer.valueOf(sqft))){
            if(period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6){
              if (CompleteSprinkler)  {
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Sprinkler Certificate"
                period.addToAgentDocs(list)
              }
            }  else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                  if (CompleteSprinkler || AutoSprinkler)  {
                    //Create Activity
                    var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                    var list = new AgentDocList_Ext(period)
                    list.DocumentName = "Sprinkler Certificate"
                    period.addToAgentDocs(list)
                  }
                }
          }else if (period.BaseState.Code == typekey.State.TC_FL){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                if (CompleteSprinkler || AutoSprinkler)  {
                  //Create Activity
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Sprinkler Certificate"
                  period.addToAgentDocs(list)
                  var activity =  activityPattern.createJobActivity(gw.transaction.Transaction.getCurrent(), period.Job, "Protective Device Follow Up", "Protective Device Follow Up", null, null, null, null, null)
                }

              }else if ( period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                if (CompleteSprinkler || AutoSprinkler)  {
                  //Create Activity
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Sprinkler Certificate"
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  period.addToAgentDocs(list)
                }
              }
          }else if (period.BaseState.Code == typekey.State.TC_HI){
            if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
              if (AutoSprinkler)  {
                //Create Activity
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Sprinkler Certificate"
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                period.addToAgentDocs(list)
              }

            }else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
              if (CompleteSprinkler )  {
                //Create Activity
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Sprinkler Certificate"
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                period.addToAgentDocs(list)
              }
            }
            }else if (period.BaseState.Code == typekey.State.TC_NV){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                if (CompleteSprinkler )  {
                  //Create Activity
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Sprinkler Certificate"
                  period.addToAgentDocs(list)
                }
              }
            } else if (period.BaseState.Code == typekey.State.TC_NC){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                if (CompleteSprinkler || AutoSprinkler)  {
                  //Create Activity
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Sprinkler Certificate"
                  period.addToAgentDocs(list)
                }
              }
            }else if(period.BaseState.Code == typekey.State.TC_SC &&
                (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
              if (CompleteSprinkler)  {
                //Create Activity
                var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                var list = new AgentDocList_Ext(period)
                list.DocumentName = "Sprinkler Certificate"
                period.addToAgentDocs(list)
              }
            }else if(period.BaseState.Code == typekey.State.TC_TX)  {
                if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOA_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOB_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT){
                    if (CompleteSprinkler)  {
                        //Create Activity
                        var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                        var list = new AgentDocList_Ext(period)
                        list.DocumentName = "Sprinkler Certificate"
                        period.addToAgentDocs(list)
                    }
                }else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                if (CompleteSprinkler )  {
                  //Create Activity
                  var list = new AgentDocList_Ext(period)
                  list.DocumentName = "Sprinkler Certificate"
                  var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
                  period.addToAgentDocs(list)
                }

              }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

