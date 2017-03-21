package gw.job

uses una.config.ConfigParamsUtil
uses java.util.Date
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.mapping.creditreport.CreditReportRequestDispatcher
uses gw.api.job.JobProcessLogger
uses gw.plugin.job.IPolicyRenewalPlugin
uses gw.plugin.Plugins
uses gw.plugin.note.impl.LocalNoteTemplateSource
uses gw.api.email.EmailContact
uses gw.api.email.EmailUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/27/16
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */
class UNAHORenewalProcess extends AbstractUNARenewalProcess {
  private static final var CONSENT_TO_RATE_ACTIVITY_PATTERN : String = "upload_consent_to_rate_confirm"

  construct(period : PolicyPeriod){
    super(period)
  }

  public function onUploadConsentToRateForm(){
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Begin 'onUploadConsentToRateForm' for transaction ${this.Job.JobNumber}.  Current Renewal Job Status is %{this.Job.SelectedVersion.Status}")
    }

    if(ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.HomeownersLine_HOE.HOPolicyType)){
      if(java.util.Date.CurrentDate.afterOrEqualsIgnoreTime(PendingRenewalFirstCheckDate) and !this._branch.ConsentToRateReceived_Ext){ //consent to rate has previously been sent out and not yet received
        editRenewalWithActions(\ -> {
          this._branch.ConsentToRateReceived_Ext = true
          this.Job.AllOpenActivities?.atMostOneWhere( \ activity -> activity.ActivityPattern.Code?.equalsIgnoreCase(CONSENT_TO_RATE_ACTIVITY_PATTERN))?.complete()
        }, displaykey.una.historyevent.ConsentToRateReceived)
      }
    }

    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("End 'onUploadConstentToRateForm' for transaction ${this.Job.JobNumber}.  Renewal Job status resumed with status %{this.Job.SelectedVersion.Status}")
    }
  }

  override function pendingRenewalFirstCheck(){
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Begin 'pendingRenewalFirstCheck' for transaction ${this.Job.JobNumber}.")
    }

    handleAlarmDiscountRemovalProcess()
    super.pendingRenewalFirstCheck()

    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("End 'pendingRenewalFirstCheck' for transaction ${this.Job.JobNumber}.")
    }
  }

  override function pendingRenewalFinalCheck(){
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Begin 'pendingRenewalFinalCheck' for transaction ${this.Job.JobNumber}.")
    }

    retrieveIntegratedPolicyData({INSURANCE_CREDIT_SCORE, CLAIMS})
    handleConsentToRateProcess()
    executeOOTBFinalCheckCode()

    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("End 'pendingRenewalFinalCheck' for transaction ${this.Job.JobNumber}.")
    }
  }

  override property get PendingRenewalFinalCheckDate() : Date{
    return getOffsetDate(TC_RenewalFinalCheckLeadTime)
  }

  protected override property get RenewalLeadTimeConfigFilter() : String{
    var result : String

    if(ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.Policy.ProductCode)){
      result = _branch.Policy.ProductCode + _branch.ConsentToRateReceived_Ext
    }else{
      result = super.RenewalLeadTimeConfigFilter
    }

    return result
  }

  protected override property get InflationFactorConfigFilter() : String{
    return _branch.HomeownersLine_HOE.HOPolicyType.Code
  }

  protected override function retrieveInsuranceCreditScores(){
    if(ConfigParamsUtil.getBoolean(TC_ShouldOrderInsScoreCredit, _branch.BaseState, _branch.Policy.ProductCode)){
      var lastReceivedCreditReport = _branch.NamedInsureds*.LastCreditReportReceived?.orderByDescending(\ creditReport -> creditReport.CreditScoreDate)?.first()
      var creditNamedInsured = lastReceivedCreditReport.PolicyContactRole
      var secondPersonToOrderFor = _branch.NamedInsureds.firstWhere( \ namedInsured -> namedInsured.AccountContactRole.AccountContact.Contact.ID != creditNamedInsured.AccountContactRole.AccountContact.Contact.ID)
      var response : CreditReportResponse

      if(shouldOrderCreditReport(lastReceivedCreditReport)){
        response = orderCreditReport(creditNamedInsured)

        if(shouldOrderCreditReportForSNI(response, secondPersonToOrderFor)){
          response = orderCreditReport(secondPersonToOrderFor)
        }

        if(shouldReopenCreditUWIssue()){
          reopenCreditUWIssue()
        }
      }
    }
  }

  /**
   *  This is the OOTB final check code.  I made the original function abstract "pendingRenewalFinalCheck".  The abstract class implements this as a "do nothing" step for CPP and BOP to share
   *  Here, we do need to execute things in the final step because we also needed to make use of the first check for HO Renewals
  */
  private function executeOOTBFinalCheckCode() {
    var escalationReasonChecker = shouldEscalatePendingRenewal()
    if (escalationReasonChecker.ShouldEscalate) {
      escalate(escalationReasonChecker.ActivitySubject, escalationReasonChecker.ActivityDescription)
    } else {
      var plugin = Plugins.get(IPolicyRenewalPlugin)
      if(plugin.isRenewalOffered(_branch)){
        _timeoutHandler.scheduleTimeoutOperation(_branch, SendNotTakenDate, "sendNotTakenForRenewalOffer", true)
      }else{
        _timeoutHandler.scheduleTimeoutOperation(_branch, IssueAutomatedRenewalDate, "issueAutomatedRenewal", false)
      }
    }
  }

  private function shouldOrderCreditReport(lastReceivedCreditReport : CreditReportExt) : boolean{
    return lastReceivedCreditReport.CreditScoreDate == null or lastReceivedCreditReport.CreditScoreDate?.addYears(1)?.afterOrEqualsIgnoreTime(Date.CurrentDate)
  }

  private function orderCreditReport(namedInsured : PolicyContactRole) : CreditReportResponse{
    return new CreditReportRequestDispatcher(namedInsured, _branch).orderNewCreditReport(namedInsured.ContactDenorm.PrimaryAddress, namedInsured.FirstName, namedInsured.MiddleName, namedInsured.LastName, namedInsured.DateOfBirth)
  }

  private function shouldOrderCreditReportForSNI(response: CreditReportResponse, secondPersonToOrderFor: PolicyContactRole) : boolean{
    return !typekey.CreditStatusExt.TF_RECEIVEDCREDITSTATUSES.TypeKeys.contains(response.StatusCode) and secondPersonToOrderFor != null
  }

  private function shouldReopenCreditUWIssue() : boolean {
    return _branch.CreditInfoExt.CreditReport.CreditStatus == null or _branch.CreditInfoExt.CreditReport.CreditStatus == TC_NOT_ORDERED
  }

  private function reopenCreditUWIssue(){
    var creditReportNotOrderedIssue = _branch.UWIssuesIncludingSoftDeleted.atMostOneWhere( \ uwIssue -> uwIssue.IssueType.Code == "CreditReportNotOrdered")

    if(creditReportNotOrderedIssue.HasApprovalOrRejection){
      creditReportNotOrderedIssue.reopen()
    }
  }

  private function handleConsentToRateProcess() {
    var consentToRateActivityPattern = ActivityPattern.finder.findActivityPatternsByCode(CONSENT_TO_RATE_ACTIVITY_PATTERN).atMostOne()

    if(shouldRequestConsentToRate()){
      var consentToRateActivity = createRenewalActivity(TC_UNDERWRITER, CONSENT_TO_RATE_ACTIVITY_PATTERN)

      Job.addToFormsEvents(new FormsEvent(Job){:EventType = FormsEventType.TC_SENDCONSENTTORATE})
      Job.createCustomHistoryEvent(CustomHistoryType.TC_CTRIDENDIFIED, \ -> displaykey.Web.CTR.History.Event.Msg)
    }
  }

  private function shouldRequestConsentToRate(): boolean {
    return ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.HomeownersLine_HOE.HOPolicyType)
       and _branch.ConsentToRate_Ext and !_branch.ConsentToRateReceived_Ext
  }

  private function handleAlarmDiscountRemovalProcess(){
    if(shouldProceedWithAlarmDiscountRemoval()){
      resetAlarmFlags()
      sendAlarmDiscountRemovalLetter()
      createAlarmDiscountRemovalNote()
      sendEmailToAgentOfRecord()
    }
  }

  private function shouldProceedWithAlarmDiscountRemoval() : boolean{
    var renewalEffectiveDate = this._branch.PeriodStart
    var lastAlarmDocumentReceivedDate = this._branch.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.AlarmDocumentReceivedDate
    var protectionDetails = this._branch.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails
    var hasAlarmFlags = protectionDetails.FireAlarmReportCntlStn or protectionDetails.BurglarAlarmReportCntlStn or protectionDetails.FireAlarmReportFireStn or protectionDetails.FireAlarmReportPoliceStn
    return hasAlarmFlags and !this.Job.AlarmCreditRemovalLetterSent and (lastAlarmDocumentReceivedDate == null or lastAlarmDocumentReceivedDate <= renewalEffectiveDate.addYears(-3))
  }

  private function resetAlarmFlags(){
    this._branch.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.FireAlarmReportCntlStn = false
    this._branch.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.BurglarAlarmReportCntlStn = false
    this._branch.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.FireAlarmReportFireStn = false
    this._branch.HomeownersLine_HOE.Dwelling.DwellingProtectionDetails.FireAlarmReportPoliceStn = false
  }

  private function sendAlarmDiscountRemovalLetter(){
    this.Job.addToFormsEvents(new FormsEvent(Job){:EventType = tc_SendAlarmCreditRemovalLetter})
    this.Job.AlarmCreditRemovalLetterSent = true
  }

  private function createAlarmDiscountRemovalNote(){
    var plugin = new LocalNoteTemplateSource()
    plugin.setParameters({})
    var noteTemplate = plugin.getNoteTemplate("AlarmCreditRemoved.gosu")

    var note = new Note(Job)
    note.useTemplate(noteTemplate)
    note.Policy = this._branch.Policy
    note.Level = this._branch.Policy
  }

  function sendEmailToAgentOfRecord(){
    var template =  gw.plugin.Plugins.get(gw.plugin.email.IEmailTemplateSource).getEmailTemplate("AlarmCreditRemovedEmailTemplate.gosu")
    var producerCodeOfRecord = this._branch.ProducerCodeOfRecord.Contact_Ext

    var email = new gw.api.email.Email()
    var emailContact = new EmailContact(producerCodeOfRecord){:EmailAddress = producerCodeOfRecord.EmailAddress1}
    email.addToRecipient(emailContact)
    email.Sender = getSender()
    email.Html = true
    email.useEmailTemplate(template, {"pni" -> this._branch.PrimaryNamedInsured.DisplayName, "policyNumber" -> this._branch.PolicyNumber})

    EmailUtil.sendEmailWithBody(null, email)
    email.saveAsDocument(this._branch, this._branch.Policy, tc_out_corr, tc_outcorr_remove_protective_device_credit)
  }

  private function getSender() : EmailContact{
    var sender = new EmailContact()
    var user = edge.util.helper.UserUtil.getUserByName("ghopkins")
    sender.EmailAddress = "underwriting@uihna.com"
    sender.Name = user.Contact.FirstName + " " + user.Contact.LastName

    return sender
  }
}