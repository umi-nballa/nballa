package onbase.api.pluginimpl

uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.Settings

uses java.lang.Long
uses java.lang.NumberFormatException

uses org.apache.commons.lang.StringUtils

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/20/2015 - Daniel Q. Yu
 *     * Initial implementation.
 *
 *   06/08/2015 - Daniel Q. Yu
 *     * Transfer OnBase document type into GW document object.
 */
/**
 * Convert document object between OnBase and Guidewire.
 */
class DocumentConversion {
  /**
   * Convert OnBase document to Guidewire document object.
   *
   * @param obDocument The OnBase document to be converted.
   *
   * @return The result Guidewire document.
   */
  public static function convertOnBaseDocumentToGuidewire(obDocument: OnBaseDocument): Document {
    var gwDocument = new Document()
    gwDocument.DocUID = obDocument.DocID as String
    gwDocument.PublicID = obDocument.DocID as String
    gwDocument.DocumentIdentifier = obDocument.DocID as String
    gwDocument.SecurityType = Settings.DocumentSecurity
    gwDocument.MimeType = obDocument.MimeType
    gwDocument.Name = StringUtils.left(obDocument.Name, 80)
    gwDocument.Author = obDocument.Author
    gwDocument.Description = obDocument.Description
    gwDocument.DateCreated = obDocument.DateCreated
    gwDocument.DateModified = obDocument.DateModified
    gwDocument.Status = DocumentStatusType.get(obDocument.Status)
    gwDocument.Type = DocumentType.get(obDocument.DocumentType)
    gwDocument.OnBaseDocumentType = StringUtils.left(obDocument.OnBaseDocumentType, 255)
    gwDocument.Recipient = obDocument.Recipient
    gwDocument.DMS = true
    gwDocument.Inbound = true
  	gwDocument.DocumentLanguage =  Settings.DocumentLocale
    return gwDocument
  }

  /**
   * Convert Guidewire document to OnBase document object.
   *
   * @param gwDocument The Guidewire document to be converted.
   *
   * @return The result OnBase document.
   */
  public static function convertGuidewireDocumentToOnBase(gwDocument: Document): OnBaseDocument {
    var obDocument = new OnBaseDocument()
    obDocument.DocID = convertDocumentId(gwDocument.DocUID)
    obDocument.SecurityType = gwDocument.SecurityType as String
    obDocument.MimeType = gwDocument.MimeType
    obDocument.Name = gwDocument.Name
    obDocument.Author = gwDocument.Author
    obDocument.DateCreated = gwDocument.DateCreated
    obDocument.DateModified = gwDocument.DateModified
    obDocument.Status = gwDocument.Status as String
    obDocument.OnBaseDocumentType = gwDocument.OnBaseDocumentType
    return obDocument
  }

  /**
   * Convert document id from String to long. Sometimes GW has invalid docId such as "none", so we shouldn't throw exception but treat them as not found.
   *
   * @param docId The document id to be converted.
   *
   * @return The result document in in long.
   */
  public static function convertDocumentId(docId: String): long {
    var id: long = -1
    try {
      id = Long.parseLong(docId)
    } catch (ex: NumberFormatException) {
    }
    return id
  }
}
