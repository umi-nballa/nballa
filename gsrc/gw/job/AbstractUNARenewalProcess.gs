package gw.job

uses com.guidewire.pl.system.bundle.validation.EntityValidationException
uses una.config.ConfigParamsUtil
uses gw.api.job.JobProcessLogger
uses java.util.Date
uses gw.plugin.Plugins
uses gw.plugin.job.IPolicyRenewalPlugin
uses java.lang.Throwable
uses gw.job.uw.UWAuthorityBlocksProgressException
uses gw.api.web.job.JobWizardHelper
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 9/19/16
 * Time: 4:44 PM
 *
 * This and its subtypes was placed in package gw.job to not hinder preloading
 * and for JobWizardHelperEnhancement accessibility.
 * Intentionally made abstract to disable instantiation.
 */
abstract class AbstractUNARenewalProcess extends RenewalProcess{
  protected static final var RENEWAL_USER: String = "renewal_daemon"
  private var _resumeStatus : PolicyPeriodStatus
  private var _resumeRenewalCode : String

  protected enum DATA_RETRIEVAL_TYPES {
    CLAIMS("retrieveInternalClaims"), TUNA("retrieveTunaData"), INSURANCE_CREDIT_SCORE("retrieveInsuranceCreditScores")

    private var _methodName : String

    private construct(retrievalMethodName : String){
      this._methodName = retrievalMethodName
    }

    property get MethodName() : String{
      return _methodName
    }
  }

  construct(period : PolicyPeriod){
    super(period)
  }

  /*****************************************OVERRIDDEN RENEWAL PROPERTIES AND FUNCTIONS********************************************/
  override final property get PendingRenewalFirstCheckDate() : Date{
    return getOffsetDate(TC_RenewalFirstCheckLeadTime)
  }

  override property get PendingRenewalFinalCheckDate() : Date{
    return PendingRenewalFirstCheckDate  //BOP and CPP policies bypass final check because they perform all functions needed in first check, if any
  }

  override final property get IssueAutomatedRenewalDate() : Date{
    return getOffsetDate(TC_RenewalIssueLeadTime)
  }

  override public function requestQuote(jobWizardHelper : JobWizardHelper, valLevel: ValidationLevel, ratingStyle : RatingStyle, warningsThrowException : boolean){
    applyInflationFactor()
    super.requestQuote(jobWizardHelper, valLevel, ratingStyle, warningsThrowException)
  }

  override function startPendingRenewal(){
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Begin 'StartPendingRenewal' for transaction ${this.Job.JobNumber}.")
    }

    retrieveIntegratedPolicyData({TUNA, CLAIMS})
    super.startPendingRenewal()

    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("End 'StartPendingRenewal' for transaction ${this.Job.JobNumber}.")
    }
  }

  override function pendingRenewalFirstCheck(){
    super.pendingRenewalFirstCheck()
  }

  override function pendingRenewalFinalCheck(){
    //do nothing for BOP and CPP.  HO has a first and final check.
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Bypassing final check for renewal process.")
    }
  }

  override function issueAutomatedRenewal(){
    super.issueAutomatedRenewal()
  }

  /********************************************OVERRIDDEN NON-RENEW PROPERTIES*******************************************************/

  override final protected property get PendingNonRenewalFirstCheckDate() : Date {
    return this._branch.PeriodStart.addDays(-NonRenewLeadTime) //no "final check" step for UNA
  }

  override final function pendingNonRenewalFirstCheck(){
    var escalationReasonChecker = shouldEscalateNonRenewal()
    if (escalationReasonChecker.ShouldEscalate) {
      escalate(escalationReasonChecker.ActivitySubject, escalationReasonChecker.ActivityDescription)
    } else {
      if (Job.NonRenewalNotifDate == null) {
        sendNonRenewalDocuments()
      }

      //the below bypasses the "pendingNonRenewalFinalCheck" by scheduling the non-renewal issuance.
      super._timeoutHandler.scheduleTimeoutOperation(_branch, SendNonRenewalDate, "sendNonRenewal", false)
    }
  }

  protected final property get SendNonRenewalDate() : Date {
    return IssueAutomatedRenewalDate
  }

  /************************************************OVERRIDDEN NOT-TAKEN PROPERTIES*****************************************************/
  protected final property get PendingNotTakenFirstCheckDate() : Date {
    return PendingRenewalFirstCheckDate
  }

  protected final property get PendingNotTakenFinalCheckDate() : Date {
    return PendingRenewalFirstCheckDate //no "final check" step for UNA
  }

  protected final property get SendNotTakenDate() : Date {
    return IssueAutomatedRenewalDate
  }

  /*****************************************************CUSTOM RENEWAL CODE***************************************************************/

  /**
  *  Added to bypass catching and escalation of UWAuthorityBlocksProgressException.  In this case, we re-throw to allow
  *  the RenewalAutoCompleteBatchProcess to automatically resolve the issues.
  *  Should only be used for RenewalAutoCompleteBatchProcess
  */
  public function issueRenewalSansUWIssueEscalation(){
    try{
     canIssueAutomatedRenewal().assertOkay()
     _branch.onBeginIssueJob()
     unconditionalIssueRenewal()
    }catch(e : UWAuthorityBlocksProgressException){
      throw e
    }catch(e : EntityValidationException){
      var reasonChecker = new EscalationReasonChecker(TC_RENEWING).addCustomError(displaykey.Job.Renewal.Escalation.Reason.ValidationErrors)
      escalate(reasonChecker.ActivitySubject, reasonChecker.ActivityDescription)
    }catch(e : Throwable){
      var reasonChecker = new EscalationReasonChecker(TC_RENEWING).addCustomError(displaykey.Job.Renewal.Escalation.Reason.Other)
      escalate(reasonChecker.ActivitySubject, reasonChecker.ActivityDescription)
    }
  }

  protected property get RenewalLeadTimeConfigFilter() : String{
    return _branch.Policy.ProductCode
  }

  protected property get InflationFactorConfigFilter() : String{
    return _branch.Policy.ProductCode
  }

  protected final function retrieveIntegratedPolicyData(dataRetrievalTypes : List<DATA_RETRIEVAL_TYPES>){
    dataRetrievalTypes.each( \ dataRetrievalType -> {
      runMethodAsRenewalUser(dataRetrievalType.MethodName)
    })
  }

  protected function retrieveInsuranceCreditScores(){
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Bypassing credit ordering for product ${_branch.Policy.ProductCode}")
    }
  }

  protected function retrieveInternalClaims(){
    //TODO tlv retrieve internal claims from internal claims and data warehouse.  Per Prathyush, we will only use the data warehouse when that is up
  }

  protected function retrieveTunaData(){
    //TODO tlv decision was made to not integrate TUNA on initial release
  }

  protected final function editRenewalWithActions(actionsToExecute(), historyEvent : String){
    if(_branch.checkBaseEditability()){
      executeEditAction(actionsToExecute, historyEvent)
    }
  }

  protected final function createRenewalActivity(pattern : String, queue : String) : Activity{
    var result : Activity

    var activityPattern = ActivityPattern.finder.findActivityPatternsByCode(pattern).single()
    result = activityPattern.createJobActivity(this.Job.Bundle, this.Job, null, null, null, null, null, null, null)

    if(result !=  null){
      ActivityUtil.assignActivityToQueue(queue, queue, result)
    }

    return result
  }

  private function applyInflationFactor(){
    if(shouldApplyInflationFactor()){
      _branch.AllCoverables*.applyInflationFactor()
      _branch.Renewal.InflationFactorApplied = true
    }
  }

  protected function getOffsetDate(configParameter : ConfigParameterType_Ext) : Date{
    var daysOffset = ConfigParamsUtil.getInt(configParameter, _branch.BaseState, RenewalLeadTimeConfigFilter)
    return _branch.PeriodStart.addDays(-daysOffset)
  }

     private function shouldApplyInflationFactor() : boolean{
    var renewalStartDate = Plugins.get(IPolicyRenewalPlugin).getRenewalStartDate(_branch.BasedOn == null ? _branch : _branch.BasedOn)

    return !this.Job.InflationFactorApplied
       and ConfigParamsUtil.getBoolean(TC_ShouldApplyInflationFactor, _branch.BaseState, InflationFactorConfigFilter)
       and Date.CurrentDate.afterOrEqualsIgnoreTime(renewalStartDate)
  }

  private function executeEditAction(performEditRenewalAction(), historyEventMessage: String){
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      _branch = bundle.add(_branch)
      _branch.edit()
      performEditRenewalAction()

      if(historyEventMessage != null){
        _branch.Job.createCustomHistoryEvent(TC_RENEWAL, \ -> historyEventMessage)
      }

      resumeAfterEdit()
    }, RENEWAL_USER)
  }

  private function resumeAfterEdit(){
    switch(_resumeStatus){
      case TC_QUOTED:
        requestQuote()
        break
      case TC_RENEWING:
        requestQuote()
        preSchedulePendingRenewal()
        Job.RenewalCode = this.Job.RenewalCode
        pendingRenew()
        break
      case TC_NONRENEWING:
        requestQuote()
        pendingNonRenew()
        break
      case TC_NOTTAKEN:
        requestQuote()
        pendingNotTaken()
        break
      default:
        //do nothing for resume
    }
  }
}