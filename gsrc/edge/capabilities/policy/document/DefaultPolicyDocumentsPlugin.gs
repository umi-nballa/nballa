package edge.capabilities.policy.document

uses edge.capabilities.document.dto.DocumentReferenceDTO
uses edge.capabilities.document.local.IDocumentSessionPlugin
uses java.util.ArrayList
uses edge.di.annotations.ForAllGwNodes
uses edge.capabilities.policy.document.dto.PolicyDocumentDTO
uses edge.capabilities.document.util.DocumentUtil
uses edge.capabilities.policy.document.dto.PolicyDocumentUploadDTO
uses edge.security.authorization.exception.NoAuthorityException
uses gw.api.web.document.DocumentsHelper
uses edge.security.EffectiveUserProvider

/**
 * Default implementation of policy documents plugin.
 */
class DefaultPolicyDocumentsPlugin implements IPolicyDocumentsPlugin {
  
  private var _sessionProvider : IDocumentSessionPlugin

  private var _userProvider : EffectiveUserProvider as readonly UserProvider

  @ForAllGwNodes
  @Param("sessionProvider", "Session provider for document access")
  construct(sessionProvider : IDocumentSessionPlugin, aUserProvider:EffectiveUserProvider) {
    this._sessionProvider = sessionProvider
    this._userProvider = aUserProvider
  }


  override function canAccess(doc : Document) : Boolean {
    return isPortalDefaultAccessible(doc)
  }

  
  override function getPolicyDocuments(period : PolicyPeriod) : Document[] {
    final var documents = new ArrayList<Document>()
    documents.addAll(period.Documents.toCollection())
    final var policyDocsQuery = gw.api.database.Query.make(Document).compare("Policy", Equals, period.Policy)
    documents.addAll(policyDocsQuery.select().toCollection())
    return documents
      .where(\doc -> canAccess(doc))
      .toTypedArray()
  }
    
  
  override function getDocumentReference(doc : Document) : DocumentReferenceDTO {
    ensureAccess(doc)
    return new DocumentReferenceDTO (doc.PublicID, _sessionProvider.getDocumentSession())
  }


  override function getDocumentDetails(doc : Document) : PolicyDocumentDTO {
    ensureAccess(doc)
    final var res = new PolicyDocumentDTO()
    DocumentUtil.fillDocumentBase(res, doc)
    res.SessionID = _sessionProvider.getDocumentSession()
    res.WorkingPublicID = doc.PublicID
    res.PolicyNumber = doc.PolicyPeriod.PolicyNumber
    res.CanDelete = canDelete(doc)
    return res
  }  
  

  override function createDocumentMetadata(policy : PolicyPeriod,  req : PolicyDocumentUploadDTO) : Document {
    final var res = new Document(policy.Bundle)
    DocumentUtil.fillDocumentWithDefaults(res, req)
    res.Type = typekey.DocumentType.TC_LETTER_RECEIVED
    res.SecurityType = DocumentSecurityType.TC_UNRESTRICTED
    res.Author = UserProvider.EffectiveUser.Username
    res.Level = policy.Policy  // Is this required? Level is a hidden property
    return res
  }



  override function deleteDocument(document : Document) {
    if (!canDelete(document)) {
      throw new NoAuthorityException()
    }
    DocumentsHelper.deleteDocument(document)
  }


  /**
   * "Delete" access check for the user and document.
   */
  protected function canDelete(doc : Document) : Boolean {
    return canAccess(doc) && doc.Author == UserProvider.EffectiveUser.Username
  }
  
  
  /**
   * Ensures that user have an access to the given document.
   */
  final function ensureAccess(doc : Document) {
    if (!canAccess(doc)) {
      throw new NoAuthorityException()
    }
  }
  
  
 /**
  * Checks if document is accessible to any portal. Some documents may be restricted
  * for the portal users (like sensitive documents or internal documents).
  */
  static function isPortalDefaultAccessible(document : Document) : Boolean {
    return 
        document.SecurityType != DocumentSecurityType.TC_SENSITIVE &&
        document.SecurityType != DocumentSecurityType.TC_INTERNALONLY && 
        !document.Obsolete;
  }


}
