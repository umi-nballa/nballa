package una.integration.batch.renewal

uses una.integration.batch.AbstractPolicyPeriodBatchProcess
uses java.lang.Exception
uses java.util.Date
uses gw.api.database.Query
uses gw.plugin.Plugins
uses gw.plugin.job.IPolicyRenewalPlugin
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/17/16
 * Time: 12:01 PM
 * To change this template use File | Settings | File Templates.
 */
class OpenRenewalsAutomationBatchProcess extends AbstractPolicyPeriodBatchProcess {
  private static var ACTIVITY_PATTERN : String = "open_renewal_resume_failed"

  construct(){
    super(TC_OpenRenewalsAutomation)
  }

  override function findEligiblePolicyPeriods(): List<PolicyPeriod> {
    var openPeriods = Query.make(PolicyPeriod).or(\ orCriteria -> {
      orCriteria.compare(PolicyPeriod#Status, Equals, PolicyPeriodStatus.TC_DRAFT)
      orCriteria.compare(PolicyPeriod#Status, Equals, PolicyPeriodStatus.TC_QUOTED)
    })

    var openRenewalPeriods = openPeriods?.join(PolicyPeriod#Job)?.compare(Job#Subtype, Equals, typekey.Job.TC_RENEWAL).select()
    var plugin = Plugins.get(IPolicyRenewalPlugin)

    return openRenewalPeriods?.where( \ renewalPeriod -> renewalPeriod.BasedOn != null and renewalPeriod.Selected and plugin.getRenewalStartDate(renewalPeriod.BasedOn).equalsIgnoreTime(Date.CurrentDate))
  }

  override function doWorkPerPolicy(eligiblePeriod: PolicyPeriod) {
    autoRenewPeriod(eligiblePeriod)
  }

  override function createActivityPerPolicy(eligiblePeriod: PolicyPeriod) {
    if(eligiblePeriod.Status != TC_RENEWING){
      var pattern = ActivityPattern.finder.findActivityPatternsByCode(ACTIVITY_PATTERN).atMostOne()
      var activity = pattern?.createJobActivity(eligiblePeriod.Bundle, eligiblePeriod.Job, null, null, null, null, null, null, null)
      var queue = (eligiblePeriod.HomeownersLine_HOEExists) ? ActivityUtil.ACTIVITY_QUEUE.RENEWALS.QueueName : ActivityUtil.ACTIVITY_QUEUE.CL_UW.QueueName

      ActivityUtil.assignActivityToQueue(queue, queue, activity)
    }
  }

  override function onPerPolicyExceptionOccurred(eligiblePeriod: PolicyPeriod) {
    createActivityPerPolicy(eligiblePeriod)
  }

  override function getExecutionSliceDate(policyPeriod: PolicyPeriod): Date {
    return policyPeriod.PeriodStart
  }

  override property get PerPolicyExceptionBlock(): block(PolicyPeriod, Exception): String {
    return \ _branch, e -> "Unable to execute renewal auto start on open renewal ${_branch.Job.JobNumber}.  Skipping... Exception: ${e}"
  }

  override property get ExecutionUserName(): String {
    return "renewal_daemon"
  }

  private function autoRenewPeriod(eligiblePeriod : PolicyPeriod){
    //skip warnings for renewal auto start
    (gw.transaction.Transaction.Current as com.guidewire.pl.system.bundle.EntityBundleImpl).CommitOptions.setValidationOption(com.guidewire.pl.system.bundle.validation.BundleValidationOption.VALIDATE_ERRORS_ONLY)

    if(eligiblePeriod.Status == TC_DRAFT){
      eligiblePeriod.RenewalProcess.requestQuote()
      eligiblePeriod.RenewalProcess.preSchedulePendingRenewal()
      eligiblePeriod.RenewalProcess.pendingRenew()
    }

    if(eligiblePeriod.Status == TC_QUOTED){
      eligiblePeriod.RenewalProcess.preSchedulePendingRenewal()
      eligiblePeriod.RenewalProcess.pendingRenew()
    }
  }

  override property get PerBatchRunExceptionBlock(): block(Exception): String {
    return null
  }

  override function doWorkPerBatchRun() {
  }

  override function onPerBatchJobExceptionOccurred() {
  }
}