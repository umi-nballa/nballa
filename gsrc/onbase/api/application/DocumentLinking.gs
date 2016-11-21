package onbase.api.application

uses gw.api.database.Query
uses gw.api.util.Logger
uses onbase.api.Settings

uses java.util.ArrayList

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   09/12/2016 - Daniel Q. Yu
 *     * Initial implementation for PC8 doclink metadata package.
 */
/**
 * Document linking application.
 */
class DocumentLinking {
  /** Logger */
  private var logger = Logger.forCategory(Settings.ApplicationLoggerCategory)
  /**
   * Link a document to entity.
   *
   * @param entity The entity which documents linked to.
   * @param document The document to be linked to the entity.
   * @param linkType The document link type.
   */
  public function linkDocumentToEntity(entity: KeyableBean, document: Document, linkType: Settings.DocumentLinkType) {
    linkDocumentsToEntity(entity, new Document[]{document}, linkType)
  }

  /**
   * Link multiple documents to entity.
   *
   * @param entity The entity which documents linked to.
   * @param documents The list of document ids to be linked to the entity.
   * @param linkType The document link type.
   */
  public function linkDocumentsToEntity(entity: KeyableBean, documents: Document[], linkType: Settings.DocumentLinkType) {
    if (logger.DebugEnabled) {
      logger.debug("Running method DocumentLinking.linkDocumentToEntity(" + entity + "," + documents + "," + linkType + ")")
    }
    var user = User.util.CurrentUser == null ? User.util.UnrestrictedUser : User.util.CurrentUser
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      foreach (doc in documents) {
        var link = new OnBaseDocumentLink_Ext()
        link.LinkType = linkType
        link.LinkedEntity = entity.PublicID
        link.Document = doc
      }
    }, user)
  }

  /**
   * Unlink a document from entity.
   *
   * @param entity The entity which document to be unlinked from.
   * @param document The document to be unlinked from the entity.
   * @param linkType The document link type.
   */
  public function unlinkDocumentFromEntity(entity: KeyableBean, document: Document, linkType: Settings.DocumentLinkType) {
    unlinkDocumentsFromEntity(entity, new Document[]{document}, linkType)
  }

  /**
   * Unlink multiple documents from entity.
   *
   * @param documents The list of documents to be unlinked from the entity.
   * @param linkType The document link type.
   * @param entityId The entity id which document to be unlinked from.
   */
  public function unlinkDocumentsFromEntity(entity: KeyableBean, documents: Document[], linkType: Settings.DocumentLinkType) {
    if (logger.DebugEnabled) {
      logger.debug("Running method DocumentLinking.unlinkDocumentsFromEntity(" + entity + "," + documents + "," + linkType + ")")
    }
    var user = User.util.CurrentUser == null ? User.util.UnrestrictedUser : User.util.CurrentUser
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      foreach (doc in documents) {
        var query = Query.make(OnBaseDocumentLink_Ext)
        query.compare("LinkType", Equals, linkType.toString())
        query.compare("LinkedEntity", Equals, entity.PublicID)
        query.compare("Document", Equals, doc)
        var result = query.select().first()
        if (result != null) {
          bundle.delete(result)
        }
      }
    }, user)
  }

  /**
   * Get documents linked to entity.
   *
   * @param entityId The entity which documents linked to.
   * @param linkType The document link type.
   *
   * @return A list of OnBase documents which linked to the entity.
   */
  public function getDocumentsLinkedToEntity(entity: KeyableBean, linkType: Settings.DocumentLinkType): List <Document> {
    if (logger.isDebugEnabled()) {
      logger.debug("Running method DocumentLinking.getDocumentsLinkedToEntity(" + entity + "," + linkType + ")")
    }
    var linkedDocs = new ArrayList<Document>()
    var query = Query.make(OnBaseDocumentLink_Ext)
    query.compare("LinkType", Equals, linkType.toString())
    query.compare("LinkedEntity", Equals, entity.PublicID)
    var queryResult = query.select()
    foreach (r in queryResult) {
      linkedDocs.add(r.Document)
    }

    return linkedDocs
  }

  /**
   * Get documents not linked to an entity in OnBase.
   *
   * @param entity The entity which documents linked to.
   * @param linkType The document link type.
   * @param beans Additional entity beans to be passed in for process.
   *
   * @return DocumentSearchResult object contains all documents linked to this entity.
   */
  public function getDocumentsNotLinkedToEntity(entity: KeyableBean, linkType: Settings.DocumentLinkType, beans: KeyableBean[]): List<Document> {
    if (logger.DebugEnabled) {
      logger.debug("Running method DocumentMetadataSource.getDocumentsNotLinkedToEntity(" + entity + ", " + linkType + ", " + beans + ")...")
    }
    var notLinked = new ArrayList<Document>()

    var criteria = new DocumentSearchCriteria()
    foreach (bean in beans) {
      if (bean typeis Account) {
        criteria.Account = bean
      } else if (bean typeis Policy) {
        criteria.Policy = bean
      }
    }
    if (criteria.Account == null && criteria.Policy == null) {
      return notLinked
    }
    criteria.IncludeObsoletes = false
    var results = criteria.performSearch()
    var linked = getDocumentsLinkedToEntity(entity, linkType)
    foreach (r in results) {
      var document = r as Document
      if (!linked.contains(document)){
        notLinked.add(document)
      }
    }
    return notLinked
  }

  /**
   * Check if a document is linked to an entity.
   *
   * @param docUID The document id to be checked.
   * @param linkType The document link type.
   * @param entity The entity to be checked.
   *
   * @return True if the document is linked to the entity.
   */
  public function isDocumentLinkedToEntity(document: Document, linkType: Settings.DocumentLinkType, entity: KeyableBean): boolean {
    if (logger.isDebugEnabled()) {
      logger.debug("Running method DocumentLinking.isDocumentLinkedToEntity(" + entity + ", " + document + "," + linkType + ")")
    }
    var results = getDocumentsLinkedToEntity(entity, linkType)
    for (doc in results) {
      if (doc.DocUID == document.DocUID) {
        return true
      }
    }
    return false
  }

  /**
   * Get the UI Label for document linking.
   *
   * @param entity The entity which documents linked to.
   * @param linkType The document link type.
   *
   * @return The UI Label.
   */
  public static function getLinkingDocumentUILabel(entity: KeyableBean, linkType: Settings.DocumentLinkType): String {
    if (!Settings.enableLinkedDocumentCount) {
      return displaykey.Accelerator.OnBase.STR_GW_DocumentListPopup_Label_NoCount
    }
    var docs = new DocumentLinking().getDocumentsLinkedToEntity(entity, linkType)
    if (docs.size() == 0) {
      return displaykey.Accelerator.OnBase.STR_GW_DocumentListPopup_Label_NoDocument
    }
    return displaykey.Accelerator.OnBase.STR_GW_DocumentListPopup_Label_ViewDocuments(docs.size())
  }
}
