package onbase.api.services.implementations.wsp

uses gw.api.util.Logger

uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.interfaces.ArchiveDocumentAsyncInterface
uses onbase.api.Settings

uses onbase.api.services.implementations.wsp.util.AsyncUploadDip
uses onbase.api.services.implementations.wsp.util.KeywordAdaptor

uses java.io.File

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   02/10/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the ArchiveDocumentASync interface that writes the
 * required DIP file locally.
 *
 * Note that this technically doesn't use WSP at all, but it exists in
 * this package as it is expected to be used in conjunction with WSP.
 *
 * Makes use of a gosu template to format the DIP file.
 * @see AsyncUploadDip
 */
class ArchiveDocumentAsyncWSP implements ArchiveDocumentAsyncInterface {

  // File extension used for the self describing dip file.
  private static final var DIP_EXTENSION = ".dip"

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  /**
   * Archive document asynchronously.
   *
   * @param documentFile The document local file.
   * @param documentType The document type.
   * @param mimeType The document MIME type.
   * @param keywords The keyword values for this document.
   */
  public override function archiveDocument(documentFile: File, documentType: String, mimeType: String, keywords: List <Keyword>){
    logger.debug("Start executing archiveDocument Async using WSP service.")

    var adaptor = new KeywordAdaptor(keywords)
    var dipFile = new File(documentFile.ParentFile, documentFile.Name + DIP_EXTENSION)
    
    var source = Settings.CurrentCenter.Code.toUpperCase() + "center"

    using (var writer = new java.io.OutputStreamWriter(new java.io.FileOutputStream(dipFile))) {
      AsyncUploadDip.render(writer, documentFile.Name, documentType, mimeType, source, adaptor)
    }

    logger.debug("Finished executing archiveDocument Async using WSP service.")
  }

}
