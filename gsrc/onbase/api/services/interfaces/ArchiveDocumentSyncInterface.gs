package onbase.api.services.interfaces

uses onbase.api.services.datamodels.Keyword

uses java.util.List

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/13/2015 - Daniel Q. Yu
 *     * Initial implementation.
 */
/**
 * Interface to call OnBase Synchronized Archive Document service.
 */
interface ArchiveDocumentSyncInterface {
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
  public function archiveDocument(documentContents: byte[], fileName: String, documentType: String, mimeType: String, keywords: List<Keyword>): String
}
