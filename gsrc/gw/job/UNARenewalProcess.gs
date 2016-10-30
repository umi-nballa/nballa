package gw.job

uses una.config.ConfigParamsUtil
uses gw.api.job.JobProcessLogger
uses java.util.Date
uses gw.plugin.Plugins
uses gw.plugin.job.IPolicyRenewalPlugin

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
abstract class UNARenewalProcess extends RenewalProcess{
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

  protected property get RenewalLeadTimeConfigFilter() : String{
    return _branch.Policy.ProductCode
  }

  override property get PendingRenewalFirstCheckDate() : Date{
    return getOffsetDate(TC_RenewalFirstCheckLeadTime)
  }

  override property get IssueAutomatedRenewalDate() : Date{
    return getOffsetDate(TC_RenewalIssueLeadTime)
  }

  override function startPendingRenewal(){
    JobProcessLogger.logDebug("Begin 'StartPendingRenewal' for transaction ${this.Job.JobNumber}.")

    retrieveIntegratedPolicyData({TUNA, CLAIMS})
    super.startPendingRenewal()

    JobProcessLogger.logDebug("End 'StartPendingRenewal' for transaction ${this.Job.JobNumber}.")
  }

  override function pendingRenewalFirstCheck(){
    super.pendingRenewalFirstCheck()
  }

  protected function retrieveIntegratedPolicyData(dataRetrievalTypes : List<DATA_RETRIEVAL_TYPES>){
    dataRetrievalTypes.each( \ dataRetrievalType -> {
      runMethodAsRenewalUser(dataRetrievalType.MethodName)
    })
  }

  protected function retrieveInternalClaims(){
    //TODO tlv retrieve internal claims from internal claims and data warehouse
  }

  protected function retrieveTunaData(){
    //TODO tlv implement retrieval for tuna data and persistence if needed
  }

  protected function retrieveInsuranceCreditScores(){
    //TODO tlv unimplemented
  }

  protected final function editRenewalWithActions(actionsToExecute(), historyEvent : String){
    if(_branch.checkBaseEditability()){
      executeEditAction(actionsToExecute, historyEvent)
    }
  }

  private function getOffsetDate(configParameter : ConfigParameterType_Ext) : Date{
    var daysOffset = ConfigParamsUtil.getInt(configParameter, _branch.BaseState, RenewalLeadTimeConfigFilter)
    return _branch.PeriodStart.addDays(-daysOffset)
  }

  private function executeEditAction(performEditRenewalAction(), historyEventMessage: String){
    var user = Plugins.get(IPolicyRenewalPlugin).getAutomatedRenewalUser(_branch)

    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      _branch = bundle.add(_branch)
      _branch.edit()
      performEditRenewalAction()

      if(historyEventMessage != null){
        _branch.Job.createCustomHistoryEvent(TC_RENEWAL, \ -> historyEventMessage)
      }

      resumeAfterEdit()
    }, user)
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