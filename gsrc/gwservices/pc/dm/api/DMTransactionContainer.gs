package gwservices.pc.dm.api

uses gwservices.pc.dm.gx.entitypopulators.Registry

/**
 * Transaction container
 */
class DMTransactionContainer {
  private var _accountApi: DMAccountAPI
  private var _cancellationApi: DMCancellationAPI
  private var _changeApi: DMPolicyChangeAPI
  private var _submissionApi: DMSubmissionAPI
  private var _renewalApi: DMRenewalAPI
  private var _reinstatementApi: DMReinstatementAPI
  private var _rewriteApi : DMRewriteAPI
  /**
   * Load the registry and the APIs
   */
  construct() {
    var registry = new Registry()
    _accountApi = new DMAccountAPI(registry)
    _cancellationApi = new DMCancellationAPI(registry)
    _changeApi = new DMPolicyChangeAPI(registry)
    _submissionApi = new DMSubmissionAPI(registry)
    _renewalApi = new DMRenewalAPI(registry)
    _reinstatementApi = new DMReinstatementAPI(registry)
    _rewriteApi = new DMRewriteAPI(registry)
  }

  function getTransactionAPI(payloadType: MigrationPayloadType_Ext): DMTransactionAPIBase {
    switch (payloadType) {
      case "Account": return _accountApi
      //case "Audit":
      case "Submission": return _submissionApi
      case "PolicyChange": return _changeApi
      case "ConversionOnRenewal": return _renewalApi
      case "NewPolicyRenewal": return _renewalApi
      case "StandardRenewal": return _renewalApi
      case "InProgressRenewal": return _renewalApi
      case "StandardCancellation": return _cancellationApi
      case "InProgressCancellation": return _cancellationApi
      case "Reinstatement": return _reinstatementApi
      case "FullTermRewrite": return _rewriteApi
      case "RemainderOfTermRewrite": return _rewriteApi
      case "NewTermRewrite": return _rewriteApi
      case "RescindCancellation": return _cancellationApi
        default: throw "not implemented ${payloadType}"
    }
  }
}