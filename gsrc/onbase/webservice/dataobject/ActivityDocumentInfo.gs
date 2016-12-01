package onbase.webservice.dataobject

uses gw.xml.ws.annotation.WsiExportable

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Change:
 *   12/02/2014 - J. Walker
 *      * Created
 *
 */
/**
 * Data object for document info from OnBase during activity create
 */
@WsiExportable("http://onbase.net/onbase/webservice/dataobject")
final class ActivityDocumentInfo {
  /** Document id */
  var _ID: long as ID
  /** Document name */
  var _Name: String as Name
  /** Document type */
  var _Type: String as Type
  /** Document author */
  var _Author: String as Author
  /** Document batch */
  var _Batch: String as Batch
  /** Document date */
  var _Date: String as Date
  /** Has document been stored */
  var _Stored: String as Stored
  /** Number of notes in document */
  var _NoteCount: long as NoteCount
  /** Document revision */
  var _Revision: String as Revision
  /** Document version */
  var _Version: String as Version
}
