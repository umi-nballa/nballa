package gw.job

uses gw.api.job.JobProcessLogger
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/27/16
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */
class UNAHORenewalProcess extends UNARenewalProcess {
  private static final var CONSENT_TO_RATE_LEAD_TIME : int = 60
  private static final var CONSENT_TO_RATE_ACTIVITY_PATTERN : String = "upload_consent_to_rate_confirm"

  construct(period : PolicyPeriod){
    super(period)
  }

  public function onUploadConsentToRateForm(){  //TODO tlv need to check how to detect this, if it is registered when it is sent out and when to confirm it was returned and how to tell the difference between the two
    JobProcessLogger.logDebug("Begin 'onUploadConsentToRateForm' for transaction ${this.Job.JobNumber}.  Current Renewal Job Status is %{this.Job.SelectedVersion.Status}")

    editRenewalWithActions(\ -> {
      this._branch.ConsentToRateReceived_Ext = true
      this.Job.AllOpenActivities?.atMostOneWhere( \ activity -> activity.ActivityPattern.Code?.equalsIgnoreCase(CONSENT_TO_RATE_ACTIVITY_PATTERN))?.complete()
    }, null)//null for now to not create a history event message

    JobProcessLogger.logDebug("End 'onUploadConstentToRateForm' for transaction ${this.Job.JobNumber}.  Renewal Job status resumed with status %{this.Job.SelectedVersion.Status}")
  }

  override function pendingRenewalFirstCheck(){
    JobProcessLogger.logDebug("Begin 'pendingRenewalFirstCheck' for transaction ${this.Job.JobNumber}.")

    retrieveIntegratedPolicyData({INSURANCE_CREDIT_SCORE, CLAIMS})
    createConsentToRateActivity()
    super.pendingRenewalFirstCheck()

    JobProcessLogger.logDebug("End 'pendingRenewalFirstCheck' for transaction ${this.Job.JobNumber}.")
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

  protected function retrieveInsuranceCreditScores(){ //TODO tlv implement ordering, work with Amair on this
  }

  private function createConsentToRateActivity() {
    var consentToRateActivityPattern = ActivityPattern.finder.findActivityPatternsByCode(CONSENT_TO_RATE_ACTIVITY_PATTERN).atMostOne()

    if(shouldRequestConsentToRate()){
      var activity = this.Job.createRoleActivity(typekey.UserRole.TC_UNDERWRITER, consentToRateActivityPattern, consentToRateActivityPattern.Subject, consentToRateActivityPattern.Description)
      activity.TargetDate = _branch.PeriodStart.addDays(-CONSENT_TO_RATE_LEAD_TIME)
      //TODO tlv send consent to rate form via event messaging.  problem might be consent to rate form is already stored once we send it.  what happens on upload again?  we will have one
      //one signed and one unsigned copy.  what do we do then? hpx doesn't care and onbase will have two copies because storage is automatic.  either need to versions or a boolean to not store
    }
  }

  private function shouldRequestConsentToRate() : boolean{
    var isConsentToRateEligible = ConfigParamsUtil.getBoolean(TC_IsConsentToRateRequired, _branch.BaseState, _branch.HomeownersLine_HOE.HOPolicyType)
    var policyDeviationFactor = 1.1 //TODO tlv this is temporary.  will need to get this from Gail

    return isConsentToRateEligible and !_branch.ConsentToRateReceived_Ext and policyDeviationFactor > 1.0
  }
}