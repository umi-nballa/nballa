package edge.capabilities.gpa.document

uses edge.capabilities.gpa.document.dto.DocumentDTO
uses edge.di.annotations.ForAllGwNodes
uses edge.capabilities.document.util.DocumentUtil
uses edge.capabilities.document.local.IDocumentSessionPlugin
uses java.lang.IllegalArgumentException
uses edge.jsonrpc.exception.JsonRpcInvalidRequestException
uses edge.capabilities.helpers.JobUtil
uses edge.capabilities.helpers.PolicyUtil
uses gw.api.web.document.DocumentsHelper
uses edge.capabilities.gpa.account.IAccountRetrievalPlugin
uses edge.PlatformSupport.Bundle

class DefaultDocumentPlugin implements IDocumentPlugin {
  private var _sessionProvider: IDocumentSessionPlugin
  private var _policyHelper: PolicyUtil
  private var _jobHelper: JobUtil
  private var _accountRetrievalPlugin: IAccountRetrievalPlugin

  @ForAllGwNodes
  @Param("sessionProvider", "Session provider for document access")
  construct(sessionProvider: IDocumentSessionPlugin, aPolicyHelper: PolicyUtil, aJobHelper: JobUtil, anAccountRetrievalPlugin: IAccountRetrievalPlugin) {
    this._sessionProvider = sessionProvider
    this._policyHelper = aPolicyHelper
    this._jobHelper = aJobHelper
    this._accountRetrievalPlugin = anAccountRetrievalPlugin
  }

  override function toDTO(document: Document): DocumentDTO {
    final var dto = new DocumentDTO()
    DocumentUtil.fillDocumentBase(dto, document)
    dto.AccountNumber = document?.Account.AccountNumber
    dto.PolicyNumber = document?.Policy.LatestPeriod.PolicyNumber
    dto.JobNumber = document?.Job.JobNumber
    dto.Level = document.Level.toString()
    dto.CanDelete = perm.Document.delete(document)
    dto.SessionID = _sessionProvider.getDocumentSession()

    return dto
  }

  override function toDTOArray(documents: Document[]): DocumentDTO[] {
    if (documents != null && documents.HasElements) {
      return documents.map(\document -> toDTO(document))
    }

    return new DocumentDTO[]{}
  }

  override function getDocumentsForAccount(anAccount: Account): Document[] {
    if (anAccount == null) {
      throw new IllegalArgumentException ("Account must not be null.")
    }
    return anAccount.Documents.where(\ document -> (document.SecurityType == null
        || document.SecurityType == DocumentSecurityType.TC_UNRESTRICTED)).toTypedArray()
  }

  override function getDocumentsForPolicy(aPolicy: Policy): Document[] {
    if (aPolicy == null) {
      throw new IllegalArgumentException ("Policy must not be null.")
    }
    final var unfilteredDocs = gw.api.database.Query.make(Document).compare("Policy", Equals, aPolicy).select()
    return unfilteredDocs.where(\doc -> (doc.SecurityType == null
        || doc.SecurityType == DocumentSecurityType.TC_UNRESTRICTED)).toTypedArray()
  }

  override function getDocumentsForJob(aJob: Job): Document[] {
    if (aJob == null) {
      throw new IllegalArgumentException ("Job must not be null.")
    }

    return aJob.Documents.where(\doc -> (doc.SecurityType == null
        || doc.SecurityType == DocumentSecurityType.TC_UNRESTRICTED)).toTypedArray()
  }

  override function createDocument(dto: DocumentDTO): Document {
    final var bundle = Bundle.getCurrent()
    final var aDocument = new Document()
    updateBaseProperties(aDocument, dto)
    aDocument.SecurityType = DocumentSecurityType.TC_UNRESTRICTED
    aDocument.Author = User.util.CurrentUser.DisplayName

    if (dto.AccountNumber != null) {
      final var _account = bundle.add(_accountRetrievalPlugin.getAccountByNumber(dto.AccountNumber))
      if (_account != null) {
        aDocument.Level = _account
        aDocument.Account = _account
      }
    } else if (dto.JobNumber != null) {
      final var _job = bundle.add(_jobHelper.findJobByJobNumber(dto.JobNumber))
      if (_job != null) {
        aDocument.Level = _job
        aDocument.Job = _job
      }
    } else if (dto.PolicyNumber != null) {
      final var _policy = bundle.add(_policyHelper.getPolicyByPolicyNumber(dto.PolicyNumber))
      if (_policy != null) {
        aDocument.Level = _policy
        aDocument.Policy = _policy
      }
    } else {
      throw new JsonRpcInvalidRequestException() {: Message = "Required Metadata not found, AccountNumber, PolicyNumber, or JobNumber is required"}
    }

    return aDocument
  }

  public static function updateBaseProperties(aDocument: Document, dto: DocumentDTO) {
    aDocument.Name = dto.Name.elide(80)
    aDocument.DocumentIdentifier = dto.Name.elide(60)
    aDocument.Type = dto.DocumentType
    aDocument.Description = dto.Description
    aDocument.MimeType = dto.MimeType
    aDocument.SecurityType = dto.SecurityType
    aDocument.Status = dto.Status
    aDocument.Author = dto.Author
    aDocument.DateModified = dto.DateModified
    aDocument.DMS = true
    aDocument.Inbound = true
    aDocument.Obsolete = false
    aDocument.PublicID = dto.PublicID
  }

  override function removeDocument(aDocument: Document): boolean {
    if (perm.Document.delete(aDocument)){
      DocumentsHelper.deleteDocument(aDocument)

      return true
    }

    return false
  }
}
