package gw.job

uses gw.api.job.JobProcessLogger
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/26/16
 * Time: 1:35 PM
 * To change this template use File | Settings | File Templates.
 */
class UNACPPRenewalProcess extends AbstractUNARenewalProcess {
  private static final var REVIEW_RENEWAL_ACTIVITY = "review_renewal"

  construct(period : PolicyPeriod){
    super(period)
  }

  override function pendingRenewalFirstCheck(){
    createRenewalActivity(REVIEW_RENEWAL_ACTIVITY, ActivityUtil.ACTIVITY_QUEUE.CL_UW)
    super.pendingRenewalFirstCheck()
  }


  //Intentionally override and do nothing.  CPP does not auto-issue renewals.  By still hitting the step but
  //intentionally doing nothing, we bypass having to use different workflows which just complicates things
  override function issueAutomatedRenewal() {
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Bypassing issue renewal step for CPP policy number ${_branch.PolicyNumber}")
    }
  }
}