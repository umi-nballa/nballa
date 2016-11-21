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

  public function onUploadConsentToRateForm(){  //TODO tlv need to check how to detect this, if it is registered when it is sent out and when to confirm it was returned and how to tell the difference between the two
    if(JobProcessLogger.DebugEnabled){
      JobProcessLogger.logDebug("Begin 'onUploadConsentToRateForm' for transaction ${this.Job.JobNumber}.  Current Renewal Job Status is %{this.Job.SelectedVersion.Status}")
    }

    if(ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.HomeownersLine_HOE.HOPolicyType)){
      editRenewalWithActions(\ -> {
        this._branch.ConsentToRateReceived_Ext = true
        this.Job.AllOpenActivities?.atMostOneWhere( \ activity -> activity.ActivityPattern.Code?.equalsIgnoreCase(CONSENT_TO_RATE_ACTIVITY_PATTERN))?.complete()
      }, displaykey.una.historyevent.ConsentToRateReceived)
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
    createConsentToRateActivity()
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

  protected function retrieveInsuranceCreditScores(){
    if(ConfigParamsUtil.getBoolean(TC_ShouldOrderInsScoreCredit, _branch.BaseState, _branch.Policy.ProductCode)){
      var lastReceivedCreditReport = _branch.NamedInsureds*.LastCreditReportReceived?.orderByDescending(\ creditReport -> creditReport.CreditScoreDate)?.first()

      if(lastReceivedCreditReport.CreditScoreDate.afterIgnoreTime(Date.CurrentDate.addYears(-1))){
        var namedInsured = lastReceivedCreditReport.PolicyContactRole
        var response : CreditReportResponse
        var exceptionOccurred : boolean

        try{
          response = new CreditReportRequestDispatcher(namedInsured, _branch).orderNewCreditReport(namedInsured.ContactDenorm.PrimaryAddress, namedInsured.FirstName, namedInsured.MiddleName, namedInsured.LastName, namedInsured.DateOfBirth)
        }catch(e : Exception){
          if(JobProcessLogger.DebugEnabled){
            JobProcessLogger.logError("Failed to retrieve credit report for contact with public id ${namedInsured.PublicID}.  Exception: %{e.StackTraceAsString}")
          }
          exceptionOccurred = true
        }

        if(exceptionOccurred or !typekey.CreditStatusExt.TF_RECEIVEDCREDITSTATUSES.TypeKeys.contains(response.StatusCode)){
          var secondNamedInsured = _branch.NamedInsureds.where( \ insured -> insured.ContactDenorm.AddressBookUID != lastReceivedCreditReport.PolicyContactRole.ContactDenorm.AddressBookUID)
              ?.orderByDescending(\ ni -> ni.LastCreditReportReceived.CreditScoreDate)?.first()
          new CreditReportRequestDispatcher(secondNamedInsured, _branch).orderNewCreditReport(secondNamedInsured.ContactDenorm.PrimaryAddress, secondNamedInsured.FirstName, secondNamedInsured.MiddleName, secondNamedInsured.LastName, secondNamedInsured.DateOfBirth)
        }
      }
    }
  }

  private function createConsentToRateActivity() {
    var consentToRateActivityPattern = ActivityPattern.finder.findActivityPatternsByCode(CONSENT_TO_RATE_ACTIVITY_PATTERN).atMostOne()

    if(shouldRequestConsentToRate()){
      var activity = this.Job?.createRoleActivity(typekey.UserRole.TC_UNDERWRITER, consentToRateActivityPattern, consentToRateActivityPattern.Subject, consentToRateActivityPattern.Description)
      activity.TargetDate = _branch.PeriodStart.addDays(-CONSENT_TO_RATE_LEAD_TIME)
      _branch.addEvent(FormsEventType.TC_SENDCONSENTTORATE)
    }
  }

  private function shouldRequestConsentToRate(): boolean {
    var isConsentToRateEligible = ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.HomeownersLine_HOE.HOPolicyType)
    var policyDeviationFactor = 1.1
    //TODO tlv this is temporary.  waiting on NC HO Rating requirements

    return isConsentToRateEligible and !_branch.ConsentToRateReceived_Ext and policyDeviationFactor > 1.0
  }
}