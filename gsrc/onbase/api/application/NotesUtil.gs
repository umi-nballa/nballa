package onbase.api.application

uses java.lang.StringBuilder
uses java.lang.StringBuffer //for currently unused function
uses java.util.HashMap
uses java.util.HashSet
uses java.util.Set
uses java.util.regex.Pattern

uses onbase.api.Settings

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   09/10/2015 - Richard R. Kantimahanthi
 *     * Initial implementation.
 *
 *   11/19/2015 - Duane Littleton
 *     * Added support for linking documents with static document text.
 *
 *   08/09/2016 - Tori Brenneison
 *     * Ported from older accelerator version
 *     * Changed to use doc ID instead of doc DocUID for linking in GW
 */
/**
 * Notes Util Class
 *  - inserts ccDocLink + document ID into note body
 *  - GW will pick up ccDocLink text and display it as a link when the note is viewed
 *  - Static document linking has been removed
 */

class NotesUtil {

  //Doc link to Notes - prefix/suffix strings
  private static final var DOC_LINK_PREFIX : java.lang.String= "$ccDocLink("
  private static final var DOC_LINK_SUFFIX : java.lang.String= ")"
  private static final var STATIC_DOCUMENT_ID_SUFFIX : java.lang.String = "-STATIC"

  // Regular expression to match normal and static document links. Note that for readability, this does
  // not use the constants above. If the constants are changed, the regular expression should be changed
  // as well.
  private static final var CC_LINK_PATTERN = Pattern.compile("\\$ccDocLink\\(((\\d+)(?:-STATIC)?)\\)");
  private static final var CC_LINK_FULL_ID_GROUP = 1
  private static final var CC_LINK_NUMERIC_ID_GROUP = 2

  //Map to temporarily hold the linked documents to Activity Note.
  private static var _activityNotelinkedDocs: HashMap<Activity, String> as ActivityNoteLinkedDocuments = new HashMap<Activity, String>()


 /**
  * Retrieve the set of document IDs that are linked within the given note text.
  *
  * @param noteBody text of the note
  */
  public static function getLinkedDocuments(noteBody : String) : Set<String> {
    var results = new HashSet<String>()

    if (noteBody.HasContent) {
      var matcher = CC_LINK_PATTERN.matcher(noteBody)
      while (matcher.find()) {
        results.add(matcher.group(CC_LINK_NUMERIC_ID_GROUP))
      }
    }

    return results
  }

 /**
  * Appends the given list of documents to the note body and returns the updated body.
  *
  * Will not add links for documents that have already been linked to the note previously.   *
  * @param documents Documents to link to the note
  * @param body Original note body
  */
  public static function appendLinkedDocuments(documents : Document[], body : String) : String {
    var alreadyLinked = getLinkedDocuments(body)

    var newLinkText = new StringBuilder(body ?: "")
    for (document in documents) {

      // Skip documents that are already linked (a document can only be linked to a note once).
      if (alreadyLinked.contains((document.ID).toString())) {
        continue
      }

      // Add each document, separated by a newline.
      if (newLinkText.length() > 0) {
        newLinkText.append("\n")
      }
      newLinkText.append(getLinkText(document))

      // Remember that the new document has been linked.
      alreadyLinked.add(document.ID)
    }

    return newLinkText.toString()
  }

 /**
  * Link a single document to a note.
  *
  * @param document Document to link
  * @param note Note to link the document to
  */
  public static function linkDocumentToNote(document : Document, note : Note) {
    note.Body = appendLinkedDocuments({document}, note.Body)
  }

 /**
  * Link multiple documents to a note.
  *
  * @param documents Documents to link
  * @param note Note to link the documents to
  */
  public static function linkDocumentsToNote(documents : Document[], note : Note) {
    note.Body = appendLinkedDocuments(documents, note.Body)
  }

 /** THIS FUNCTION IS CURRENTLY NOT IN USE
  * Search through the provided string and replace any $ccDocLink placeholders
  *
  * @param original source string to search
  * @param replace function to replace document links
  *
  * @return string with any $ccDocLink placeholders expanded
  *
  public static function replaceLinks(original : String, replace : block(id : String) : String) : String {
    var matcher = CC_LINK_PATTERN.matcher(original)

    // No need to copy the string if nothing is being replaced.
    if (!matcher.find()) {
      return original
    }

    var expandedString = new StringBuffer()

    do {
      var id = matcher.group(CC_LINK_FULL_ID_GROUP) // capture group of document ID
      matcher.appendReplacement(expandedString, replace(id))
    } while (matcher.find())

    matcher.appendTail(expandedString)
    return expandedString.toString()
  }
 */

 /**
  * Get the link text to use when linking a document to a note. Determines how to format the text
  * based on the current settings.
  *
  * @param doc Document to link
  */
  private static function getLinkText(doc : Document) : String {

    var linkText = DOC_LINK_PREFIX + doc.ID + DOC_LINK_SUFFIX
    return "${linkText}"

  }

}
