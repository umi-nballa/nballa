package edge.capabilities.gpa.document

uses edge.jsonrpc.IRpcHandler
uses edge.capabilities.document.local.IDocumentContentPlugin
uses gw.document.DocumentContentsInfo
uses gw.plugin.document.IDocumentContentSource
uses edge.capabilities.document.exception.DocumentRetrievalException
uses edge.capabilities.document.exception.DocumentErrorCode
uses edge.capabilities.document.util.DocumentUtil
uses edge.jsonrpc.annotation.JsonRpcMethod
uses edge.di.annotations.InjectableNode
uses edge.capabilities.document.local.IDocumentSessionPlugin

class DocumentHandler implements IRpcHandler, IDocumentContentPlugin {

  var _documentPlugin : IDocumentPlugin
  var _documentSessionPlugin : IDocumentSessionPlugin

  @InjectableNode
  construct(sessionProvider : IDocumentSessionPlugin, aDocumentPlugin : IDocumentPlugin){
    this._documentPlugin = aDocumentPlugin
    this._documentSessionPlugin = sessionProvider
  }

  override function getDocumentContent(id: String): DocumentContentsInfo {
    final var doc = DocumentUtil.getDocumentByPublicId(id)

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

  /**
   * Removes a document given its Public ID
   *
   * <dl>
   *   <dt>Calls:</dt>
   * <dd> <code>DocumentUtil#getDocumentByPublicId(java.lang.String)</code> - To retrieve a document given its Public ID</dd>
   * <dd> <code>IDocumentPlugin#removeDocument(Document)</code> - To remove Document</dd>
   * </dl>
   * @param   publicID  The ID of the document to remove
   */
  @JsonRpcMethod
  public function removeDocument(publicID: String) : Boolean {
    final var doc = DocumentUtil.getDocumentByPublicId(publicID)
    _documentPlugin.removeDocument(doc)

    return true
  }

  /**
   * Generate a token used to verify document upload is allowed.
   *
   * <dl>
   *   <dt>Calls:</dt>
   * <dd> <code>IDocumentSessionPlugin#getDocumentSession()</code> - To generate a session token</dd>
   * </dl>
   * @return A String document session token
   */
  @JsonRpcMethod
  public function generateUploadToken() : String {
    return _documentSessionPlugin.getDocumentSession()
  }
}
