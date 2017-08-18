package gw.rules.all.policyperiod

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocBOPCPPWindHail extends DocumentRequestRuleExecution{
  //TODO TLV keeping this comment in until Reqs come in for CR that actually tell us what to do.  Also logic might not actually be right so have to revisit once we get reqs
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("wind_hurricane_hail_rej_followup")
//  var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CSR_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return isEligible(period)
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_WindHailRejection
  }

  function isEligible(period: PolicyPeriod): boolean {
    var windpoolBOP = "Yes"
    var windpoolCPP = "Yes"

    for (loc in period.BP7Line.BP7Locations) {
      for (building in loc.Buildings) {
        var windpool = building.OverrideWindPool_Ext ? building.OverrideWindPool_Ext : building.WindPool_Ext
        if (windpool == "No"){
          windpoolBOP = windpool
        }
      }
    }

    for (loc in period.CPLine.CPLocations) {
      for (building in loc.Buildings) {
        var windpool = building.OverrideWindPool_Ext ? building.OverrideWindPool_Ext : building.Windpoolvalue_Ext
        if (windpool == "No"){
          windpoolCPP = windpool
        }
      }
    }

    if (period.BaseState.Code == typekey.State.TC_FL && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
      if (period.BP7LineExists && windpoolBOP == "No" && period.BP7Line.ExclusionsFromCoverable?.hasMatch(\elt -> elt.PatternCode == "BP7WindstormOrHailExcl_EXT")) {
        return true
      }
      else if (period.CPLineExists && windpoolCPP == "No" && period.CPLine.ExclusionsFromCoverable?.hasMatch(\elt -> elt.PatternCode == "CPWindorHailExclusion_EXT")){
        return true
      }
    }
    return false
  }
}


