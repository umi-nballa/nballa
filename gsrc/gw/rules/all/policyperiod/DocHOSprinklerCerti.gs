package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.SprinklerUtil
uses java.lang.Integer
uses una.utils.ActivityUtil
uses gw.accelerator.ruleeng.IRuleAction

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocHOSprinklerCerti implements IRuleCondition<PolicyPeriod> , IRuleAction<PolicyPeriod, PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

   if(iseligible(period))
     return RuleEvaluationResult.execute()
   else
    return RuleEvaluationResult.skip()
  }


  override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult){
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("sprinkler_doc_followup")
    var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
    ActivityUtil.assignActivityToQueue("CSR Follow up Queue", "Universal Insurance Manager's Inc", activity)

    var list = new AgentDocList_Ext(target)
    list.DocumentName =  "Sprinkler Certificate"
    target.addToAgentDocs(list)
  }

  function iseligible(period : PolicyPeriod) : boolean{

      var CompleteSprinkler = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.SprinklerSystemAllAreas
      //Automatic Sprinkler System - Designated Areas Only
      var AutoSprinkler = period.HomeownersLine_HOE?.dwelling.DwellingProtectionDetails.AutomaticSprinkler

      //year built
      var yearBuilt =  period.HomeownersLine_HOE?.dwelling.OverrideYearbuilt_Ext ? period.HomeownersLine_HOE?.dwelling.YearBuiltOverridden_Ext : period.HomeownersLine_HOE?.dwelling.Yearbuilt
      // Square feet
      var sqft = period.HomeownersLine_HOE?.dwelling.OverrideTotalSqFtVal_Ext ? period.HomeownersLine_HOE?.dwelling.TotalSqFtValOverridden_Ext : period.HomeownersLine_HOE?.dwelling.SquareFootage_Ext

              if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
                      if((period.BaseState.Code == typekey.State.TC_AZ ) &&
                    (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                            period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
                                      if (CompleteSprinkler)  {
                                            return true
                                      }
                      }else if (period.BaseState.Code == typekey.State.TC_CA &&
              SprinklerUtil.getSprinklerCredit(period.HomeownersLine_HOE?.Dwelling.HOLocation.PolicyLocation.County ,
              period.HomeownersLine_HOE?.Dwelling.HOLocation.PolicyLocation.City, yearBuilt.intValue() , Integer.valueOf(sqft))){
              if(period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                      period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6){
                              if (CompleteSprinkler)  {
                                  return true
                              }
                      }  else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                  period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                            if (CompleteSprinkler || AutoSprinkler)  {
                              return true
                            }
                            }
              }else if (period.BaseState.Code == typekey.State.TC_FL){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                                if (CompleteSprinkler || AutoSprinkler)  {
                                        return true
                                 }

                          }else if ( period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                        period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                        if (CompleteSprinkler || AutoSprinkler)  {
                              return true
                        }
                        }
              }else if (period.BaseState.Code == typekey.State.TC_HI){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
                          period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
                          if (AutoSprinkler)  {
                                return true
                          }

                          }else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
              if (CompleteSprinkler )  {

                  return true
              }
              }
              }else if (period.BaseState.Code == typekey.State.TC_NV){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
              if (CompleteSprinkler )  {
                  return true
              }
              }
              } else if (period.BaseState.Code == typekey.State.TC_NC){
              if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
              if (CompleteSprinkler || AutoSprinkler)  {
                    return true
              }
              }
              }else if(period.BaseState.Code == typekey.State.TC_SC &&
              (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4 ||
              period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6)){
              if (CompleteSprinkler)  {
                   return true
              }
              }else if(period.BaseState.Code == typekey.State.TC_TX)  {
                    if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOA_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HOB_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_HCONB_EXT){
                    if (CompleteSprinkler)  {
                        return true
                    }
                    }else if (period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP3_EXT ||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_LPP_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP1_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP2_EXT||
                    period.HomeownersLine_HOE?.HOPolicyType == typekey.HOPolicyType_HOE.TC_TDP3_EXT) {
                    if (CompleteSprinkler )  {
                          return true
                    }

                    }
                    }
              }
    return false
}

}