package onbase.api.services.datamodels

uses org.apache.commons.lang.StringEscapeUtils

uses java.io.InputStream
uses java.util.ArrayList
uses java.util.Date
uses java.util.List

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/12/2015 - csandham
 *     * Initial creation.
 *
 *   01/14/2015 - Daniel Q. Yu
 *     * Added FileContent & FileExtension
 *     * Changed DocID to long type
 *
 *   03/03/2015 - Justin Walker, Daniel Q. Yu
 *     * Added OnBase keywords & MIKG keyword for linking.
 *
 *   09/03/2015 - Daniel Q. Yu
 *     * Added UnescapeXml name and author fields because special characters are encoded during transmission of the information.
 *
 *   03/23/2016 - Daniel Q. Yu
 *     * Added AsyncDocumentId.
 */
/**
 * Data model for OnBase Document for use in the web services tier of the API.
 */
class OnBaseDocument {
  /** Document id. */
  var _docID: long as DocID
  /** Document name. */
  var _name: String as Name
  /** Document description. */
  var _description: String as Description
  /** Document author. */
  var _author: String as Author
  /** Document date created. */
  var _dateCreated: Date as DateCreated
  /** Document date modified. */
  var _dateModified: Date as DateModified
  /** Document security type. */
  var _securityType: String as SecurityType
  /** Document locale. */
  var _locale: String as Locale
  /** Document status. */
  var _status: String as Status
  /** OnBase Document type. */
  var _onbaseDocumentType: String as OnBaseDocumentType
  /** Document type. */
  var _documentType: String as DocumentType
  /** Recipient. */
  var _recipient: String as Recipient
  /** Asysnc Document Id. */
  var _asyncDocumentID: String as AsyncDocumentID
  /** Document MIME type. */
  var _mimeType: String as MimeType
  /** Document content input stream. */
  var _content: InputStream as FileContent
  /** Document file extension. */
  var _extension: String as FileExtension
  /** OnBase keywords. */
  var _displayColumns: List <Keyword> as Keywords = new ArrayList <Keyword>()
  /** OnBase MIKG keyword for linking. */
  var _links: List <Link> as Links = new ArrayList <Link>()
  /**
   * Set the Name property field.
   */
  property set Name(n: String) {
    _name = StringEscapeUtils.unescapeXml(n)
  }

  /**
   * Set the Author property field.
   */
  property set Author(a: String) {
    _author = StringEscapeUtils.unescapeXml(a)
  }

  /**
   * Return OnBase document as string.
   *
   * @return The OnBase document as string.
   */
  public override function toString(): String {
    return "OBDoc - #" + String.valueOf(_docID) + " - " + _name
  }
}
