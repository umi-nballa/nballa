package onbase.api.services

uses gw.xml.XmlElement
uses onbase.api.Settings
uses onbase.api.services.datamodels.Category
uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.services.datamodels.Template
uses onbase.api.services.datamodels.UpdateKeywordsRequest
uses onbase.api.services.interfaces.ArchiveDocumentAsyncInterface
uses onbase.api.services.interfaces.ArchiveDocumentSyncInterface
uses onbase.api.services.interfaces.DocCompCategoriesInterface
uses onbase.api.services.interfaces.DocCompExecuteInterface
uses onbase.api.services.interfaces.DocCompTemplatesInterface
uses onbase.api.services.interfaces.DocumentInfoInterface
uses onbase.api.services.interfaces.GetDocumentContentInterface
uses onbase.api.services.interfaces.QueryDocumentsInterface
uses onbase.api.services.interfaces.ScriptDispatcherInterface
uses onbase.api.services.interfaces.UpdateKeywordsInterface

uses java.io.File
uses java.lang.Class
uses java.lang.Exception
uses java.util.Hashtable
uses java.util.List
uses onbase.api.services.interfaces.CreateUnityFormInterface

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *
 *   01/14/2015 - Daniel Q. Yu
 *     * Initial implementation.
 *
 *   01/16/2015 - Richard R. Kantimahanthi
 *     * Implemented the rest of the services.
 *
 *   02/02/2015 -  J. Walker
 *     * Added Breaker pattern for fault responsiveness
 */
/**
 * The manager class for all Guidewire API services.
 */
class ServicesManager {
  /** Asnyc archive document service. */
  private static var archiveDocumentAsyncService: ArchiveDocumentAsyncInterface = new onbase.api.services.implementations.wsp.ArchiveDocumentAsyncWSP()
  /** Sync archive document service. */
  private static var archiveDocumentSyncService: ArchiveDocumentSyncInterface     = new onbase.api.services.implementations.wsp.ArchiveDocumentSyncWSP()
  /** Create Unity Form service. */
  private static var createUnityForm: CreateUnityFormInterface = new onbase.api.services.implementations.wsp.CreateUnityFormWSP()
  /** Document composition categories service. */
  private static var docCompCategoriesService: DocCompCategoriesInterface = new onbase.api.services.implementations.wsp.DocCompCategoriesWSP()
  /** Document composition templates service. */
  private static var docCompTemplateService: DocCompTemplatesInterface   = new onbase.api.services.implementations.wsp.DocCompTemplatesWSP()
  /** Document composition execute template service. */
  private static var docCompExecuteService: DocCompExecuteInterface    = new onbase.api.services.implementations.wsp.DocCompExecuteWSP()
  /** Document info service. */
  private static var documentInfoService: DocumentInfoInterface   = new onbase.api.services.implementations.wsp.DocumentInfoWSP()
  /** Get document content service. */
  private static var getDocumentContentService: GetDocumentContentInterface  = new onbase.api.services.implementations.wsp.GetDocumentContentWSP()
  /** Query documents service. */
  private static var queryDocumentService: QueryDocumentsInterface     = new onbase.api.services.implementations.wsp.QueryDocumentsWSP()
  /** Script dispatcher service. */
  private static var scriptDispatcherService: ScriptDispatcherInterface    = new onbase.api.services.implementations.wsp.ScriptDispatcherWSP()
  /** Update keywords service. */
  private static var updateKeywordsService: UpdateKeywordsInterface    = new onbase.api.services.implementations.wsp.UpdateKeywordsWSP()
  /**
   * Archive document asynchronously.
   *
   * @param documentFile The document local file.
   * @param documentType The document type.
   * @param mimeType The document MIME type.
   * @param keywords The keyword values for this document.
   */
  public function archiveDocumentAsynchronously(documentFile: File, documentType: String, mimeType: String, keywords: List <Keyword>) {
     archiveDocumentAsyncService.archiveDocument(documentFile,documentType,mimeType,keywords)
  }

  /**
   * Archive document synchronously.
   *
   * @param documentContents The document content in bytes.
   * @param fileName The document original file name.
   * @param documentType The document type.
   * @param mimeType The document MIME type.
   * @param keywords The keyword values for this document.
   *
   * @return The newly archived document id.
   */
  public function archiveDocumentSynchronously(documentContents: byte[], fileName: String, documentType: String, mimeType: String, keywords: List <Keyword>): String {
      return Breaker.checkedCall( \-> archiveDocumentSyncService.archiveDocument(documentContents, fileName, documentType, mimeType, keywords) )
  }

  /**
   * Create A Unity Form non-interactively.
   *
   * @return Unity Form Doc ID.
   */
  public function createUnityForm(unityFormName: String, keywords: List <Keyword>): String {
    return Breaker.checkedCall( \-> createUnityForm.createUnityForm(unityFormName, keywords))
  }

  /**
   * Get document composition template categories.
   *
   * @return A list of template categories.
   */
  public function getDocumentTemplateCategories(): List <Category> {
    return Breaker.checkedCall( \-> docCompCategoriesService.getDocumentTemplateCategories() )
  }

  /**
   * Get document composition templates in categories.
   *
   * @param templateCategories The template categories.
   *
   * @return A list of templates in the template categories.
   */
  public function getDocumentTemplates(templateCategories: String[]): List <Template> {
    return Breaker.checkedCall( \-> docCompTemplateService.getDocumentTemplates(templateCategories))
  }

  /**
   * Create a document from template.
   *
   * @param templateID The template id.
   * @param keywords The keyword values for this document.
   * @param xmlPayload The extra xml payload to be used to create the document.
   *
   * @return Newly created document id.
   */
  public function createDocumentFromTemplate(templateID: java.lang.Long, keywords: List <Keyword>, xmlPayload: XmlElement): String {
    return Breaker.checkedCall( \-> docCompExecuteService.createDocumentFromTemplate(templateID, keywords, xmlPayload) )
  }

  /**
   * Get the document information for a document.
   *
   * @param docId The document id.
   *
   * @return The OnBase document for this document id.
   */
  public function getDocumentInfo(docId: long): OnBaseDocument {
    return Breaker.checkedCall( \-> documentInfoService.getDocumentInfo(docId) )
  }

  /**
   * Get document content from OnBase. The content can be retrieved from document.FileContent input stream after this call.
   *
   * @param document The OnBase document.
   */
  public function getDocumentContent(document: OnBaseDocument) {
    Breaker.checkedCallVoid( \-> getDocumentContentService.getDocumentContent(document) )
  }

  /**
   * Query documents in OnBase.
   *
   * @param queryType The query type.
   * @param keywords The list of keywords for this query.
   *
   * @return A list of found OnBase documents.
   */
  public function QueryDocuments(queryType: String, keywords: List <Keyword>): List <OnBaseDocument> {
    return Breaker.checkedCall( \-> queryDocumentService.QueryDocuments(queryType, keywords))
  }

  /**
   * Dispatch a unity script in OnBase.
   *
   * @param scriptName The unity script name.
   * @param params The input parameters for the unity script.
   *
   * @return A hash table with unity script results.
   */
  public function dispatchScript(scriptName: String, params: Hashtable): Hashtable {
    return Breaker.checkedCall( \-> scriptDispatcherService.dispatchScript(scriptName, params) )
  }

  /**
   * Update OnBase documents keyword values.
   *
   * @param ukRequest The update keyword request object.
   */
  public function updateKeywords(ukRequest: UpdateKeywordsRequest) {
    Breaker.checkedCallVoid( \-> updateKeywordsService.updateKeywords(ukRequest))
  }
}
