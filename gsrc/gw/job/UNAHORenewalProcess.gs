package gw.job

uses una.config.ConfigParamsUtil
uses java.util.Date
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.mapping.creditreport.CreditReportRequestDispatcher
uses java.lang.Exception
uses gw.api.job.JobProcessLogger

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/27/16
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */
class UNAHORenewalProcess extends AbstractUNARenewalProcess {
  private static final var CONSENT_TO_RATE_LEAD_TIME : int = 60
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

    retrieveIntegratedPolicyData({INSURANCE_CREDIT_SCORE, CLAIMS})
    handleConsentToRateProcess()
    super.pendingRenewalFirstCheck()

    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("End 'pendingRenewalFirstCheck' for transaction ${this.Job.JobNumber}.")
    }
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

      if((lastReceivedCreditReport != null and lastReceivedCreditReport.CreditScoreDate.afterIgnoreTime(Date.CurrentDate.addYears(-1)) or this.Job.IsCreditOrderingRenewal)){
        response = orderCreditReport(creditNamedInsured)

        if(!typekey.CreditStatusExt.TF_RECEIVEDCREDITSTATUSES.TypeKeys.contains(response.StatusCode) and secondPersonToOrderFor != null){
          response = orderCreditReport(secondPersonToOrderFor)
        }

        if(_branch.CreditInfoExt.CreditReport.CreditStatus == null or _branch.CreditInfoExt.CreditReport.CreditStatus == TC_NOT_ORDERED){
          var creditReportNotOrderedIssue = _branch.UWIssuesIncludingSoftDeleted.atMostOneWhere( \ uwIssue -> uwIssue.IssueType.Code == "CreditReportNotOrdered")

          if(creditReportNotOrderedIssue.HasApprovalOrRejection){
            creditReportNotOrderedIssue.reopen()
          }
        }
      }
    }
  }

  override function startPendingRenewal(){

    if(_branch.HomeownersLine_HOE.Dwelling.HODW_DifferenceConditions_HOE_ExtExists){
      var event = new FormsEvent(Job){:EventType = FormsEventType.TC_SENDDIFFERENCEANDCONDITIONS}
      Job.addToFormsEvents(event)
    }

    super.startPendingRenewal()

  }

  private function orderCreditReport(namedInsured : PolicyContactRole) : CreditReportResponse{
    return new CreditReportRequestDispatcher(namedInsured, _branch).orderNewCreditReport(namedInsured.ContactDenorm.PrimaryAddress, namedInsured.FirstName, namedInsured.MiddleName, namedInsured.LastName, namedInsured.DateOfBirth)
  }

  private function handleConsentToRateProcess() {
    var consentToRateActivityPattern = ActivityPattern.finder.findActivityPatternsByCode(CONSENT_TO_RATE_ACTIVITY_PATTERN).atMostOne()

    if(shouldRequestConsentToRate()){
      var activity = this.Job?.createRoleActivity(typekey.UserRole.TC_UNDERWRITER, consentToRateActivityPattern, consentToRateActivityPattern.Subject, consentToRateActivityPattern.Description)
      activity.TargetDate = _branch.PeriodStart.addDays(-CONSENT_TO_RATE_LEAD_TIME)

      Job.addToFormsEvents(new FormsEvent(){:EventType = FormsEventType.TC_SENDCONSENTTORATE})

      Job.createCustomHistoryEvent(CustomHistoryType.TC_CTRIDENDIFIED, \ -> displaykey.Web.CTR.History.Event.Msg)
    }
  }

  private function shouldRequestConsentToRate(): boolean {
    return ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.HomeownersLine_HOE.HOPolicyType)
       and _branch.ConsentToRate_Ext and !_branch.ConsentToRateReceived_Ext
  }
}