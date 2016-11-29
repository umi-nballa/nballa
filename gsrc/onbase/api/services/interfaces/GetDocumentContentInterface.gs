package onbase.api.services.interfaces

uses onbase.api.services.datamodels.OnBaseDocument

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/14/2015 - Daniel Q. Yu
 *     * Initial implementation.
 */
/**
 * Interface to call OnBase Update GetDoc service.
 */
interface GetDocumentContentInterface {
  /**
   * Get document content from OnBase. The content can be retrieved from document.FileContent input stream after this call.
   *
   * @param document The OnBase document.
   */
  public function getDocumentContent(document: OnBaseDocument)
}
