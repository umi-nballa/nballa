package edge.capabilities.policy

uses edge.di.annotations.InjectableNode
uses edge.capabilities.policy.local.IPolicyAccessPlugin
uses edge.security.authorization.exception.NoAuthorityException
uses gw.plugin.document.IDocumentContentSource
uses edge.capabilities.policy.document.IPolicyDocumentsPlugin
uses edge.jsonrpc.IRpcHandler
uses edge.capabilities.document.util.DocumentUtil
uses edge.capabilities.document.local.IDocumentContentPlugin
uses gw.document.DocumentContentsInfo
uses edge.capabilities.document.exception.DocumentRetrievalException
uses edge.capabilities.document.exception.DocumentErrorCode
uses edge.capabilities.document.local.IDocumentSessionPlugin
uses edge.jsonrpc.annotation.JsonRpcMethod

/**
 * Handler for the policy-related document upload. This handler belongs to policy package as
 * it have access to both policy and policy-document related functionality.
 */
class PolicyDocumentHandler implements IRpcHandler, IDocumentContentPlugin {
  
  private var _policyAuthCheck : IPolicyAccessPlugin
  private var _documentPlugin : IPolicyDocumentsPlugin
  private var _documentSessionPlugin : IDocumentSessionPlugin

  @InjectableNode
  @Param("policyAuthCheck", "Policy access policy")
  @Param("documentPlugin", "Plugin used to access documents associated with the policy")
  @Param("documentSessionPlugin", "Document session management plugin")
  construct(policyAuthCheck : IPolicyAccessPlugin, documentPlugin : IPolicyDocumentsPlugin, documentSessionPlugin : IDocumentSessionPlugin) {
    this._policyAuthCheck = policyAuthCheck
    this._documentPlugin = documentPlugin
    this._documentSessionPlugin = documentSessionPlugin
  }
  
  
  override function getDocumentContent(id : String) : DocumentContentsInfo {
    final var doc = retrievePolicyDocument(id)
    
    var docContentPlugin = gw.plugin.Plugins.get(IDocumentContentSource)
    if (!docContentPlugin.OutboundAvailable) {
      throw new DocumentRetrievalException(DocumentErrorCode.CMS_TEMPORARLY_UNAVAILABLE, "The document is temporarily unavailable")
    }
    if (!docContentPlugin.isDocument(doc)) {
      throw new DocumentRetrievalException(DocumentErrorCode.DOCUMENT_NOT_IN_CMS,
                  "The document with public ID ${doc.PublicID} has no associated content or it has been removed from the CMS.")
    }

    return docContentPlugin.getDocumentContentsInfo(doc, true)
  }

  

  @JsonRpcMethod
  public function removeDocument(publicID: String) : Boolean {
    final var doc = retrievePolicyDocument(publicID)
    _documentPlugin.deleteDocument(doc)
    return true
  }


  
  @JsonRpcMethod
  public function generateUploadToken() : String {
    return _documentSessionPlugin.getDocumentSession()
  }

  

  /**
   * Fetches a policy document with the given ID. This method must ensure that
   * target user have an access to document's policy and to  the target document.
   */
  protected function retrievePolicyDocument(docId : String) : Document {
    final var doc = DocumentUtil.getDocumentByPublicId(docId)
    
    if (!canAccessDocumentPolicy(doc)) {
      throw new NoAuthorityException()
    }
    
    if (!_documentPlugin.canAccess(doc)) {
      throw new NoAuthorityException()
    }
    
    return doc
  }
  

  /**
   * Checks if given user can access a policy of the document.
   */
  protected function canAccessDocumentPolicy(doc : Document) : Boolean {
    if (doc.Policy != null && _policyAuthCheck.hasAccess(doc.Policy)) {
      return true
    }
    
    if (doc.PolicyPeriod != null && _policyAuthCheck.hasAccess(doc.PolicyPeriod)) {
      return true
    }
    
    return false
  }


}
