package gw.job

uses gw.api.job.JobProcessLogger
uses gw.plugin.Plugins
uses gw.plugin.job.IPolicyRenewalPlugin

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/26/16
 * Time: 1:41 PM
 * To change this template use File | Settings | File Templates.
 */
class UNABOPRenewalProcess extends AbstractUNARenewalProcess {
  construct(period : PolicyPeriod){
    super(period)
  }


  //Intentionally override and do nothing.  BOP does not do anything for the "first check".  By still hitting the step but
  //intentionally doing nothing, we bypass having to use different workflows which just complicates things
  override function pendingRenewalFirstCheck() {
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Bypassing pending renewal first check execution for Renewal job number ${_branch.PolicyNumber} because BOP only has two renewal steps:  Start and Issue.")
    }

    if(Plugins.get(IPolicyRenewalPlugin).isRenewalOffered(_branch)){
      _timeoutHandler.scheduleTimeoutOperation(_branch, SendNotTakenDate, "sendNotTakenForRenewalOffer", true)
    }else{
      _timeoutHandler.scheduleTimeoutOperation(_branch, IssueAutomatedRenewalDate, "issueAutomatedRenewal", false)
    }
  }
}