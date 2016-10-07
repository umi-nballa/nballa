package onbase.api.application

uses gw.api.util.Logger
uses gw.util.Base64Util
uses onbase.api.Settings
uses onbase.api.services.ServicesManager
uses onbase.api.services.datamodels.OnBaseDocument

uses java.lang.StringBuilder
uses onbase.api.AePopUtils

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/19/2015 - Daniel Q. Yu
 *     * Initial implementation, refactored from OnBaseDocumentContentSource.gs
 *
 *	4/1/2015 - mfowler
 *		added AEPOPutil refactoring
 */
/**
 * Document retrieval application.
 */
class DocumentRetrieval {
  /** Logger */
  private var logger = Logger.forCategory(Settings.ApplicationLoggerCategory)
  /** Services Manager */
  private var servicesManager = new ServicesManager()
  /**
   * Get document content from OnBase.
   *
   * @param document The OnBase document.
   */
  public function getDocumentContent(document: OnBaseDocument) {
    if (logger.DebugEnabled) {
      logger.debug("Running method DocumentRetrieval.getDocumentContent(" + document.DocID + ")")
    }
    servicesManager.getDocumentContent(document)
  }

  /**
   * Get document retrieval Unity URL.
   *
   * @param docId The document id.
   *
   * @return The encoded Unity URL for this document.
   */
  public function getDocumentUnityURL(docId: String): String {
       return AePopUtils.generateRetrievalUrl(docId)
  }

  /**
   * Get document retrieval web URL.
   *
   * @param docId The document id.
   * @param webClientType The web client type.
   *
   * @return The encoded web URL for this document.
   */
  public function getDocumentWebURL(docId: String, webClientType: Settings.OnBaseWebClientType): String {
//    return ScriptParameters.getParameterValue("OnBaseURL") + "/docpop/docpop.aspx?clientType=" + webClientType + "&docid=" + docId
    return ScriptParameters.OnBaseURL + "/docpop/docpop.aspx?clientType=" + webClientType + "&docid=" + docId

  }
}
