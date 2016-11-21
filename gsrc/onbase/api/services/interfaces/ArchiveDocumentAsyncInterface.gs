package onbase.api.services.interfaces

uses onbase.api.services.datamodels.Keyword

uses java.io.File
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
 * Interface to call OnBase Asynchronized Archive Document service.
 */
interface ArchiveDocumentAsyncInterface {
  /**
   * Archive document asynchronously.
   *
   * @param documentFile The document local file.
   * @param documentType The document type.
   * @param mimeType The document MIME type.
   * @param keywords The keyword values for this document.
   */
  public function archiveDocument(documentFile: File, documentType: String, mimeType: String, keywords: List<Keyword>)
}
