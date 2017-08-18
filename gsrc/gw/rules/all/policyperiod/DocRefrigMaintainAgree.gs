package gw.rules.all.policyperiod

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocRefrigMaintainAgree  extends DocumentRequestRuleExecution{
//  var activityPattern = ActivityPattern.finder.getActivityPatternByCode("BOP_refrig_agreement_required")
//  var activity = activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
//  ActivityUtil.assignActivityToQueue(ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, ActivityUtil.ACTIVITY_QUEUE.CL_UW_FOLLOW_UP.QueueName, activity)

  override function shouldGenerateDocumentRequest(period: PolicyPeriod): boolean {
    return period.BP7LineExists
       and period.Status == typekey.PolicyPeriodStatus.TC_QUOTED
       and executeOldLogicThatNeedsRefactoring(period)
  }

  override property get DocumentType(): DocumentRequestType_Ext {
    return TC_RefrigerationMaintenanceAgreement
  }

  private function executeOldLogicThatNeedsRefactoring(period : PolicyPeriod) : boolean{
    if(period.BaseState.Code == typekey.State.TC_FL ){
      for ( loc in period.BP7Line.BP7Locations)
      {
        var SpoilageCov = loc.Buildings.Classifications.Coverages.firstWhere( \ elt -> elt  typeis  BP7SpoilgCov )
        if (loc.Buildings.hasMatch( \ elt1 -> elt1.PropertyType == typekey.BP7PropertyType.TC_SERVICE
            || elt1.PropertyType == typekey.BP7PropertyType.TC_RETAIL || elt1.PropertyType == typekey.BP7PropertyType.TC_DISTRIBUTOR )&&
            (SpoilageCov!= null && (SpoilageCov as BP7SpoilgCov).BP7MaintenanceAgreement1Term.OptionValue == "Yes")){
            return true
        }
      }
    }

    return false
  }
}

