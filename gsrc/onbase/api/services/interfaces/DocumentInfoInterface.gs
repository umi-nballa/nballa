package onbase.api.services.interfaces

uses onbase.api.services.datamodels.OnBaseDocument

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/14/2015 - csandham
 *     * Initial creation.
 */
/**
 * Definition of the DocumentInfo Interface for the web services tier of the API.
 */
interface DocumentInfoInterface {
  /**
   * Get the document information for a document.
   *
   * @param docId The document id.
   *
   * @return The OnBase document for this document id.
   */
  public function getDocumentInfo(docId: long): OnBaseDocument
}
