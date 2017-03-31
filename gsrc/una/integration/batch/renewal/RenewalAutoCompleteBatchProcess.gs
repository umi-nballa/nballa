package una.integration.batch.renewal

uses gw.api.database.Query
uses java.lang.Exception
uses gw.job.uw.UWAuthorityBlocksProgressException
uses una.integration.batch.AbstractPolicyPeriodBatchProcess
uses java.util.Date
uses gw.job.AbstractUNARenewalProcess
uses gw.plugin.note.impl.LocalNoteTemplateSource
uses java.util.ArrayList
uses java.util.HashSet
uses java.lang.reflect.Array
uses java.lang.System

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 9/21/16
 * Time: 5:09 PM
 * To change this template use File | Settings | File Templates.
 */
class RenewalAutoCompleteBatchProcess extends AbstractPolicyPeriodBatchProcess {
  private static final var ISSUED_PATTERN_CODE : String = "renewal_auto_issued"
  private static final var ISSUANCE_FAILED_PATTERN_CODE : String = "renewal_auto_issue_failed"

  construct(){
    super(TC_RENEWALAUTOCOMPLETE)
  }

  override function doWorkPerPolicy(eligibleRenewalPeriod: PolicyPeriod){
    quotePolicy(eligibleRenewalPeriod)
    issueRenewal(eligibleRenewalPeriod)
    completeOpenActivities(eligibleRenewalPeriod)
  }

  override function createActivityPerPolicy(eligiblePeriod: PolicyPeriod) {
    if(eligiblePeriod.Status == TC_BOUND){
      createAutoIssuedRenewalActivity(eligiblePeriod, ISSUED_PATTERN_CODE)
    }else{
      createAutoIssuedRenewalActivity(eligiblePeriod, ISSUANCE_FAILED_PATTERN_CODE)
    }
  }

  override function onPerPolicyExceptionOccurred(eligiblePeriod: PolicyPeriod) {
    createAutoIssuedRenewalActivity(eligiblePeriod, ISSUANCE_FAILED_PATTERN_CODE)
  }

  override property get PerPolicyExceptionBlock(): block(eligibleRenewalPeriod : PolicyPeriod, e : Exception): String {
    return \ eligibleRenewalPeriod , e -> {return "Exception occurred attempting to auto issue Renewal period ${eligibleRenewalPeriod.Renewal.JobNumber}.  Exception = ${e} \n ${e.StackTraceAsString}"}
  }

  override property get PerBatchRunExceptionBlock(): block(e : Exception): String {
    return \ e -> {return "Exception occurred while attempting to create an activity for auto-issued renewals.  Exception = ${e} \n ${e.StackTraceAsString}"}
  }

  override function findEligiblePolicyPeriods(): List<PolicyPeriod> {
    var openPeriods = Query.make(PolicyPeriod).or(\ orCriteria -> {
      orCriteria.compare(PolicyPeriod#Status, Equals, PolicyPeriodStatus.TC_DRAFT)
      orCriteria.compare(PolicyPeriod#Status, Equals, PolicyPeriodStatus.TC_QUOTED)
    })

    var renewalJoin = openPeriods?.join(PolicyPeriod#Job)?.compare(Job#Subtype, Equals, typekey.Job.TC_RENEWAL)
    var renewalsDueToday = renewalJoin.select().where( \ openRenewal -> Date.CurrentDate.afterOrEqualsIgnoreTime(openRenewal.RenewalProcess.IssueAutomatedRenewalDate)
                                                                    and openRenewal == openRenewal.Job.SelectedVersion)
    renewalsDueToday.removeWhere( \ renewal -> renewal.Policy.ProductCode == "CommercialPackage")

    return renewalsDueToday?.toList()
  }

  override property get ExecutionUserName(): String {
    return "renewal_daemon"
  }

  override function getExecutionSliceDate(policyPeriod: PolicyPeriod): Date {
    return policyPeriod.EditEffectiveDate
  }

  private function quotePolicy(eligibleRenewalPeriod: PolicyPeriod){
    if(eligibleRenewalPeriod.Status == TC_DRAFT){
      executeAndAutomaticallyResolveUWIssues(\ -> eligibleRenewalPeriod.RenewalProcess?.requestQuote(null, ValidationLevel.TC_QUOTABLE, RatingStyle.TC_DEFAULT, false))
      eligibleRenewalPeriod.JobProcess.attemptQuoteReleaseForNonprivilegedUser()
    }
  }

  private function issueRenewal(eligibleRenewalPeriod: PolicyPeriod){
    if(eligibleRenewalPeriod.RenewalProcess.canIssueAutomatedRenewal().Okay){
      executeAndAutomaticallyResolveUWIssues(\ -> (eligibleRenewalPeriod.RenewalProcess as AbstractUNARenewalProcess).issueRenewalSansUWIssueEscalation())

      if(eligibleRenewalPeriod.Status == TC_QUOTED){ //if any issues were resolved the first time, we will try to re-issue again
        executeAndAutomaticallyResolveUWIssues(\ -> (eligibleRenewalPeriod.RenewalProcess as AbstractUNARenewalProcess).issueRenewalSansUWIssueEscalation())
      }
    }
  }

  private function completeOpenActivities(eligibleRenewalPeriod : PolicyPeriod){
    var completedActivities = new HashSet<String>()

    eligibleRenewalPeriod.Renewal
        .AllOpenActivities
        .where( \ elt -> {return {ISSUED_PATTERN_CODE, ISSUANCE_FAILED_PATTERN_CODE}.contains(elt.ActivityPattern.Code) == false} )
        .each( \ elt ->
    {

      eligibleRenewalPeriod.Bundle.add(elt)
      elt.complete()

      completedActivities.add(elt.DisplayName)
    })

    if(completedActivities.HasElements) {
      var plugin = new LocalNoteTemplateSource()
      plugin.setParameters({})
      var noteTemplate = plugin.getNoteTemplate("RenewalAutoCompleteBatch.gosu")

      var note = new Note(eligibleRenewalPeriod.Renewal)

      note.useTemplate(noteTemplate)
      note.Policy = eligibleRenewalPeriod.Policy
      note.Level = eligibleRenewalPeriod.Policy

      note.Body += System.lineSeparator() + org.apache.commons.lang3.StringUtils.join(completedActivities, System.lineSeparator())
    }
  }

  private function executeAndAutomaticallyResolveUWIssues(executableJobProcess()){
    try{
      executableJobProcess()
    }catch(uwException : UWAuthorityBlocksProgressException){
      clearUWIssues(uwException.BlockingIssues?.toList())
    }
  }

  private function clearUWIssues(blockingIssues : List<UWIssue>){
    blockingIssues?.each( \  uwIssue -> {
      uwIssue.createAutoApproval()
      uwIssue.Approval.AutomaticApprovalCause = "Systematically approved to enable auto-issuance of Renewal transaction"
      uwIssue.createApprovalHistoryFromCurrentValues()
    })
  }

  private function createAutoIssuedRenewalActivity(policyPeriod : PolicyPeriod, patternCode : String) {
    var pattern = ActivityPattern.finder.findActivityPatternsByCode(patternCode)?.atMostOne()
    var activity = pattern.createPolicyActivity(policyPeriod.Bundle, policyPeriod.Policy, null, null, null, null, null, null, null)
    activity.assignActivityToQueue(null, null)  //TODO tlv this needs to be assigned and the subject / description need to be defined by busine
  }

  override function doWorkPerBatchRun(){
  }

  override function onPerBatchJobExceptionOccurred() {
  }
}