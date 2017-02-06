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


  //Bypassing first logic in base class to immediately schedule the issue automated renewal step without processing any data
  //IMPORTANT:  If any logic is needed in the future for the first check, you must ensure that the first check date is appropriately set in config parameters using the
  //renewal first check lead time config parameter.  Also call super.pendingRenwealFirstCheck after executing any code needed here.
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