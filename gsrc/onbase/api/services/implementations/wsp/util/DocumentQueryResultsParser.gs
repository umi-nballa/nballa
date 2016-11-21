package onbase.api.services.implementations.wsp.util

uses gw.api.util.Logger

uses onbase.api.KeywordMap
uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.datamodels.Link
uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.Settings
uses onbase.api.Settings.DocumentLinkType

uses java.lang.Long

uses java.util.Map
uses java.util.HashMap
//TODO: OnBase - commented out awaiting taxonomy
//uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.Document


/**
 * Hyland Build Version: 16.0.0.999
 */

/**
 * Translates the results of a QueryDocuments web service call into
 * the proper format for Guidewire to consume.
 *
 * Specifically, the following operations are performed:
 * 1) Convert display columns into a list of keywords.
 * 2) Add any link keywords to the list of links contained in OnBaseDocument
 * 3) If a User keyword is present, use it to override the default OnBase Author
 */
class DocumentQueryResultsParser {

  private var _logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  private var _documentResults = new HashMap<Long, OnBaseDocument>()

  /**
   * Create a new DocumentQueryResultsParser from the given Document list.
   *
   * @param documents List of documents returned from the web service
   */
  public construct(documents : List<Document>) {
    foreach (var doc in documents) {
      var obDoc = getOnBaseDocument(doc)
      var keyMap = getKeywordMapFromDisplayColumns(doc)
      setKeywordsFromMap(obDoc, keyMap)
    }
  }

  /**
   * Access the List of OnBaseDocument objects created from the web service
   * results.
   *
   * @return A list of OnBaseDocument
   */
  public function toOnBaseDocumentList() : List<OnBaseDocument> {
    return _documentResults.values().toList()
  }

  /**
   * Convert a list of documents returned from the web services into a list of
   * OnBaseDocuments in the format the rest of the Gosu code expects.
   *
   * @param documents List of documents returned from the web service
   * @return List of OnBaseDocument objects in the proper format
   */
  public static function toOnBaseDocumentList(documents : List<Document>) : List<OnBaseDocument> {
    return new DocumentQueryResultsParser(documents).toOnBaseDocumentList()
  }

  /**
   * Creates a new OnBaseDocument instance for the specified Document results or
   * returns the existing instance if one has already been created.
   *
   * Duplicate document IDs can appear in the results list when multiple MIKG
   * instances are present. This will occur if the document is linked to
   * multiple entities.
   */
  private function getOnBaseDocument(doc : Document) : OnBaseDocument {
    var obDoc = _documentResults.get(doc.DocumentIdentifier)       //TODO: OnBase - Changed to from DocuemntHandle to Document Identifier

    //TODO: OnbBase - commented out until taxonomy complete
  /*  // If the document isn't already in the map, create a new one.
    if (obDoc == null) {
      obDoc = new OnBaseDocument()
      obDoc.DocID = doc.DocumentHandle.toLong()
      obDoc.Name = doc.Name
      obDoc.Author = doc.CreatedBy
      obDoc.OnBaseDocumentType = doc.DocTypeName
      obDoc.DateCreated = doc.DateStored.toDate()
      obDoc.DateModified = doc.DocDate.toDate()
      obDoc.Status = doc.DocStatus

      // Hard-coded in the mapping for the eis interface, duplicating the values here for now.
      obDoc.Locale = Settings.DocumentLocale.Code
      obDoc.SecurityType = Settings.DocumentSecurity.toString()

      _documentResults.put(obDoc.DocID, obDoc)
    }*/

    return obDoc
  }

  /**
   * Converts the DisplayColumns on a document into a map of ColumnNames to values.
   */
  private function getKeywordMapFromDisplayColumns(doc: Document) : Map<String, String> {
    var keywords = new HashMap<String, String>()
  //TODO: OnBase - commented out awaiting taxonomy
/*    // Use the raw xml $Children instead of the generated types. This allows
    // the logic to remain the same if DisplayColumns are added or removed.
    foreach (var child in doc DisplayColumns.$Children) {
      var key = child.QName.LocalPart
      var value = child.SimpleValue.StringValue

      if (value.HasContent) {
        keywords.put(key, value)
      }
    }*/

    return keywords
  }

  /**
   * Add keywords to the OnBaseDocument based on the keyword map passed in. Will also
   * update the Links and Author as needed based on the keywords that are present.
   */
  private function setKeywordsFromMap(obDoc : OnBaseDocument, keyMap : Map<String, String>) {
    keyMap.eachKeyAndValue( \ k, val -> obDoc.Keywords.add(new Keyword(k, val)))

   /* // Add any links in the map.
    if (keyMap.containsKey(KeywordMap.linktype.OnBaseColumnName)) {
      var linkTypeName = keyMap.get(KeywordMap.linktype.OnBaseColumnName)
      var linkValue = keyMap.get(KeywordMap.linkvalue.OnBaseColumnName)

      var linkType = DocumentLinkType.AllValues.firstWhere( \lt -> linkTypeName.equalsIgnoreCase(lt.toString()))
      if (linkType == null) {
        _logger.error("Could not find DocumentLinkType of value ${linkTypeName}")
      }
      obDoc.Links.add(new Link(linkType, linkValue))
    }

    // Set the user if present.
    var user = keyMap.get(KeywordMap.user.OnBaseColumnName)
    if (user.HasContent) {
      obDoc.Author = user
    }

    // Set the status if present
    var status = keyMap.get(KeywordMap.status.OnBaseColumnName)
    if (status.HasContent) {
      obDoc.Status = status
    }

    // Set the filename if present
    var filename = keyMap.get(KeywordMap.filename.OnBaseColumnName)
    if (filename.HasContent) {
      obDoc.Name = filename
    }

    // Set the description if present
    var description = keyMap.get(KeywordMap.description.OnBaseColumnName)
    if (description.HasContent) {
      obDoc.Description = description
    }

    var docType = keyMap.get(KeywordMap.documenttype.OnBaseColumnName)
    if (docType.HasContent) {
      obDoc.DocumentType = docType
    }

    var recipient = keyMap.get(KeywordMap.recipient.OnBaseColumnName)
    if (recipient.HasContent) {
      obDoc.Recipient = recipient
    }

    var asyncDocID = keyMap.get(KeywordMap.asyncdocumentid.OnBaseColumnName)
    if (asyncDocID.HasContent) {
      obDoc.AsyncDocumentID = asyncDocID
    }*/
  }
}
