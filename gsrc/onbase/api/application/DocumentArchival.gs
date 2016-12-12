package onbase.api.application

uses gw.api.util.Logger
uses onbase.api.Settings
uses onbase.api.exception.BreakerOpenException
uses onbase.api.exception.InvalidContentException
uses onbase.api.exception.NullContentException
uses onbase.api.exception.ServicesTierServerConnectionException
uses onbase.api.exception.ServicesTierServerErrorException
uses onbase.api.exception.WriteFailedException
uses onbase.api.services.ServicesManager
uses onbase.api.services.datamodels.Keyword

uses java.io.BufferedOutputStream
uses java.io.ByteArrayOutputStream
uses java.io.File
uses java.io.FileOutputStream
uses java.io.InputStream
uses java.lang.Exception
uses java.util.UUID
uses onbase.api.services.interfaces.ArchiveDocumentSyncInterface

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/16/2015 - Daniel Q. Yu
 *     * Initial implementation, refactored from OnBaseDocumentContentSource.gs
 *
 *   01/23/2015 - Daniel Q. Yu
 *     * Passing asyncFolder & asyncSize as method parameters.
 *     * Throws InvalidContentException and WriteFailedException.
 *
 *   02/05/2015 - Richard R. Kantimahanthi
 *     * Modified 'archiveDocument' method signature to accept Document entity instead of the document metadata. This is done so in order to fire off the 'DocumentStore' custom event in case of Services Tier Exception.
 *     * The event when fired will push the request into the GW message queue to be processed asynchronously.
 *
 *   02/06/2015 - Richard R. Kantimahanthi
 *     * Modified 'archiveDocument' method to also catch the 'BreakerOpenException' exception.
 *
 *   02/23/2015 - Richard R. Kantimahanthi
 *     * Modified 'archiveDocument' method to also catch the 'ServicesTierServerConnectionException' exception.
 *
 *   01/28/2016 - Richard R. Kantimahanthi
 *     * Added logic to map mime types for openxml office documents before archiving them to OnBase.
 *
 *   03/24/2016 - Daniel Q. Yu
 *     * Added Batch process link async document for async archive.
 *
 *   05/23/2016 - Anirudh Mohan
 *     * set document's PendingDocUID to a GUID/UUID value. And assigned it to the asyncdocumentid keyword;for async archive
 *
 */
/**
 * Document archival application.
 */
class DocumentArchival {
  /** Logger */
  private var logger = Logger.forCategory(Settings.ApplicationLoggerCategory)
  /** Services Manager  */
  private var servicesManager = new ServicesManager()
  /**
   * Archive a document to OnBase.
   *
   * @param documentContents The document content input stream.
   * @param document The document to be added to OnBase.
   * @param keywords The keyword values for this document.
   * @param asyncFolder The async folder if using async document upload.
   * @param asyncSize The async size limit if using async document upload.
   *
   * @return The newly added document id or 0 if using async upload.
   */
  public function archiveDocument(documentContents: InputStream, document: Document, keywords: List <Keyword>, asyncFolder: File, asyncSize: long): String {
    if (logger.DebugEnabled) {
      logger.debug("Running method DocumentArchival.archiveDocument(" + documentContents + ", " + document + ")")
    }
    // Document content is not null, compare document size with AsyncDocumentSize to determine sync or async upload method.
    var baos = new ByteArrayOutputStream()
    var localFile: File = null
    if (asyncFolder != null) {
      localFile = new File(asyncFolder, (UUID.randomUUID() as String))
    }
    var useAsync = isDocumentSizeOverAsyncSize(documentContents, baos, localFile, asyncSize)
    // Document has zero byte content.
    if (baos.size() == 0) {
      logger.error("Calling DocumentArchival.archiveDocument for new document with zero byte document content.");
      throw new NullContentException("Calling DocumentArchival.archiveDocument for new document with zero byte document content.")
    }
    var docID: String
    try {
      // Document size is larger than AsyncDocumentSize, so use async upload method.
      if (useAsync) {
        //PENDING**
        //NOTE:pendingdocuid needs to be set back to null later so that isDocumentPending doesn't have true in it.
        document.PendingDocUID=UUID.randomUUID().toString();
        keywords.add(new Keyword("asyncdocumentid", document.PendingDocUID))
        servicesManager.archiveDocumentAsynchronously(localFile, document.Type.Code, document.MimeType, keywords)
        if (logger.DebugEnabled) {
          logger.debug("Document " + localFile + " has been saved to local folder and waiting for OnBase to pick up later.")
        }

        // No OnBase document id, just return 0.
        docID = "0"
      } else {
        // Sychronized upload document to OnBase.
        docID = servicesManager.archiveDocumentSynchronously(baos.toByteArray(), document.Name, document.OnBaseDocumentType.DisplayName, document.MimeType, keywords)
      }
    } catch (ex: ServicesTierServerErrorException) {
      logger.error("'ServicesTierServerErrorException' occurred while archiving document to OnBase. Pushing the request into the message queue to be processed asynchronously...")
      //In case the error happened while trying to archive document synchronously then write the document contents to a folder to be picked up by the Message Transporter later.
      if (!useAsync){
        this.saveDocContentsToAsyncFolder(baos.toByteArray(), localFile)
      }
      document.DocumentIdentifier = localFile.getName()
      document.addEvent("DocumentStore")
    } catch (ex: ServicesTierServerConnectionException) {
      logger.error("'ServicesTierServerConnectionException' occurred while archiving document to OnBase. Pushing the request into the message queue to be processed asynchronously...")
      //In case the error happened while trying to archive document synchronously then write the document contents to a folder to be picked up by the Message Transporter later.
      if (!useAsync){
        this.saveDocContentsToAsyncFolder(baos.toByteArray(), localFile)
      }
      document.DocumentIdentifier = localFile.getName()
      document.addEvent("DocumentStore")
    } catch (ex: BreakerOpenException) {
      logger.error("'BreakerOpenException' occurred while archiving document to OnBase. Pushing the request into the message queue to be processed asynchronously...")
      //In case the error happened while trying to archive document synchronously then write the document contents to a folder to be picked up by the Message Transporter later.
      if (!useAsync){
        this.saveDocContentsToAsyncFolder(baos.toByteArray(), localFile)
      }
      document.DocumentIdentifier = localFile.getName()
      document.addEvent("DocumentStore")
    }
    return docID
  }

  /**
   * Is the document size larger than AsyncDocumentSize?
   *
   * If true, then document content saved to localFile.
   * If false, then document content read into output byte array for synchronized upload.
   *
   * @param input The document content input stream.
   * @param output The document content in byte array output stream.
   * @param localFile The document local file if use async upload.
   * @param asyncSize The async size limit if using async document upload.
   *
   * @return True if document size is over async size limit.
   */
  private function isDocumentSizeOverAsyncSize(input: InputStream, output: ByteArrayOutputStream, localFile: File, asyncSize: long): boolean {
    // Read document content to byte array but no more than AsyncDocumentSize
    var total = 0 as long
    try {
      var buf = new byte[1024]
      // Check if the Async is enabled. If not then read the input byte stream and return false.
      if (localFile != null) {
        while (total < asyncSize) {
          var count = input.read(buf)
          if (count < 0) {
            break
          }
          output.write(buf, 0, count)
          total += count
        }
      } else {
        while (true) {
          var count = input.read(buf)
          if (count < 0) {
            break
          }
          output.write(buf, 0, count)
          total += count
        }
        output.flush();
        return false
      }
      output.flush();
    } catch (ex: Exception) {
      logger.error("Unable to read document content to byte array or write document content to local file.", ex)
      throw new InvalidContentException("Unable to read document content to byte array or write document content to local file.")
    }
    if (logger.DebugEnabled) {
      logger.debug("Total document byte read : " + total + " and current async size is :" + asyncSize)
    }
    // All document content has been read into the byte array and smaller than AsyncDocumentSize, so return false.
    if (total < asyncSize) {
      return false
    }
    // Save document content to local folder then return true.
    var fileOutputStream = null as BufferedOutputStream
    try {
      fileOutputStream = new BufferedOutputStream(new FileOutputStream(localFile))
      var buf = new byte[1024]
      // Write out previous read document content.
      if (total > 0) {
        fileOutputStream.write(output.toByteArray())
      }
      // Write out anything left in inputstream.
      while (true) {
        var count = input.read(buf)
        if (count < 0) {
          break
        }
        fileOutputStream.write(buf, 0, count)
      }
      fileOutputStream.close()
      return true
    } catch (ex: Exception) {
      logger.error("Unable to write document content to local file " + localFile, ex)
      throw new WriteFailedException("Unable to write document content to local file " + localFile)
    } finally {
      // Close fileOutputStream again when exception thrown.
      try {
        if (fileOutputStream != null) {
          fileOutputStream.close()
        }
      } catch (ex: Exception) {
      }
    }
  }


  /**
   * Save document content to local file.
   *
   * @param input The document content in bytes.
   * @param localFile The local file to be saved to.
   */
  private function saveDocContentsToAsyncFolder(input: byte[], localFile: File) {
    var fileOutputStream = null as BufferedOutputStream
    fileOutputStream = new BufferedOutputStream(new FileOutputStream(localFile))
    try {
      fileOutputStream.write(input)
    } catch (ex: Exception) {
      logger.error("Unable to write document content to local file " + localFile, ex)
      throw new WriteFailedException("Unable to write document content to local file " + localFile)
    } finally {
      // Close fileOutputStream again when exception thrown.
      try {
        if (fileOutputStream != null) {
          fileOutputStream.close()
        }
      } catch (ex: Exception) {
      }
    }
  }
}
