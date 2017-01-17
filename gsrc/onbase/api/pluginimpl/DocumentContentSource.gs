package onbase.api.pluginimpl

uses gw.api.util.DateUtil
uses gw.api.util.DisplayableException
uses gw.api.util.Logger
uses gw.document.DocumentContentsInfo
uses gw.plugin.InitializablePlugin
uses gw.plugin.Plugins
uses gw.plugin.document.IDocumentContentSource
uses onbase.api.Settings
uses onbase.api.application.DocumentArchival
uses onbase.api.application.DocumentRetrieval
uses onbase.api.exception.NullContentException
uses onbase.api.services.datamodels.Keyword

uses java.io.File
uses java.io.InputStream
uses java.lang.Exception
uses java.lang.Long
uses java.util.Map
uses java.util.ArrayList
uses onbase.api.services.datamodels.InsuredName
uses onbase.api.KeywordMap

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *     * 05/31/2016 - Anirudh Mohan
 *          * Initital Implementation - Merged the format of Claim center 9 and replaced with Policy center keywords
 *
 *     * 06/07/2016 - Anirudh Mohan
 *          * Implemented removeDocument function
 *
 *      06/09/2016 - Anirudh Mohan
 *          * Updated the keyword in updateDoc from relateddocumenthandle to documentidforrevision
 *
 *       06/21/2016 - Anirudh Mohan
 *          * Fixed the getDocumentContentsInformation to be able to view docs from Web Client also by viewing it via a window.open
 */
/**
 * IDocumentContentSource plugin implementation with OnBase as DMS.
 */
class DocumentContentSource implements IDocumentContentSource, InitializablePlugin {

  /** Metadata plugin name */
  private static final var _metadataPlugin = "IDocumentMetadataSource"
  /** OnBase client type to show documents.  Unity or Web */
  private static var _onbaseClientType: Settings.OnBaseClientType = null
  /** OnBase web client type. HTML or ActiveX */
  private static var _onbaseWebClientType: Settings.OnBaseWebClientType = null
  /** Async upload document size. */
  private static var _asyncDocumentSize: long = - 1
  /** Async upload document folder. */
  private static var _asyncDocumentFolder: File = null
  /** Async Enabled  */
  private var _asyncEnabled: boolean
  /** Logger for OnBaseDMS */
  private var logger = Logger.forCategory(Settings.PluginLoggerCategory)
  /** properties used by admin pages.  */
  /**  OnBase web client type setting.  */
  public static property get OnBaseWebClientType(): String {
    return _onbaseWebClientType.toString()
  }

  /** OnBase client type setting. */
  public static property get OnBaseClientType(): String {
    return _onbaseClientType.toString()
  }

  /** Document size triggers async document upload. */
  public static property get AsyncDocumentSize(): long {
    return _asyncDocumentSize
  }

  /** Async document upload folder location. */
  public static property get AsyncDocumentFolder(): File {
    return _asyncDocumentFolder
  }

  /** Check if aync document upload is enabled. */
  public property get isAsyncUploadEnabled(): Boolean {
    return _asyncEnabled
  }

  /**
   * If true document can be stored, updated and removed from OnBase.
   */
  override property get InboundAvailable(): boolean {
    return true
  }

  /**
   * If true document can be searched and viewed from OnBase.
   */
  override property get OutboundAvailable(): boolean {
    return true
  }

  /**
   * Add a document to OnBase. Document content and metadata are archived to OnBase here.
   *
   * This method returns false if we also want Guidewire OOTB implementation to save
   * the document metadata when IDocumentMetadataSource plugin is not used.
   *
   * @param documentContents The document content input stream.
   * @param document The document object.
   * @return True if document meta data information has been saved. Or false then IDocumentMetadataSource.saveDocument will be called to save meta data.
   */
  override function addDocument(documentContents: InputStream, document: Document): boolean {
    if (logger.DebugEnabled) {
      logger.debug("Running method DocumentContentSource.addDocument(" + documentContents + ", " + document + ")")
    }
    // Document content is null, update document meta data only.
    if (documentContents == null) {
      if (isDocument(document)) {
        document.DateModified = DateUtil.currentDate()
      } else {
        logger.error("Calling DocumentContentSource.addDocument for new document without document content.");
        throw new DisplayableException("Calling DocumentContentSource.addDocument for new document without document content.")
      }
      if (logger.DebugEnabled) {
        logger.debug("Document " + document.DocUID + " has been added to OnBase.")
      }
      // return true to ignore IDocumentMetadataSource.saveDocument or false uses Guidewire OOTB implementation to save metadata again.
      return Plugins.isEnabled(_metadataPlugin)
    }
    // Call onbase.api.application to do the real work.
    var docUID = null as String
    try {
      docUID = addKeyword(documentContents, document, _asyncDocumentFolder, _asyncDocumentSize)
    } catch (ex1: NullContentException) {
      if (isDocument(document)) {
        // Document is created document template and from rules, do nothing here.
      } else {
        throw new DisplayableException("Calling DocumentContentSource.addDocument for new document with zero byte document content.")
      }
      return Plugins.isEnabled(_metadataPlugin)
    } catch (ex2: Exception) {
      logger.error("Adding document to OnBase failed!", ex2)
      throw new DisplayableException("Adding document to OnBase failed!")
    }
    if (docUID == null) {
      // No metadata needs to be saved, so return true here.
      return true
    } else {
      // return true to ignore IDocumentMetadataSource.saveDocument or false uses Guidewire OOTB implementation to save metadata again.
      return Plugins.isEnabled(_metadataPlugin)
    }
  }

  /**
   * Add a document to OnBase.
   *
   * @param documentContents The document content input stream.
   * @param document The document to be added to OnBase.
   * @param asyncFolder The async folder if using async document upload.
   * @param asyncSize The async size limit if using async document upload.
   *
   * @return The newly added document id or null if using async upload.
   */
  public function addKeyword(documentContents: InputStream, document: Document, asyncFolder: File, asyncSize: long): String {
    var keywords = new ArrayList <Keyword>()

    // Add document account number.
    keywords.add(new Keyword(KeywordMap.accountnumber.Name, document.Account.AccountNumber))
    // Add document properties.
    keywords.add(new Keyword(KeywordMap.status.Name, document.Status.toString()))
    keywords.add(new Keyword(KeywordMap.description.Name, document.Description?.toUpperCase()))

    keywords.add(new Keyword(KeywordMap.subtype.Name, document.OnBaseDocumentSubtype?.DisplayName))
    keywords.add(new Keyword(KeywordMap.onbasedocumenttype.Name, document.OnBaseDocumentType?.DisplayName))

    //Add any Policy related keywords
    var policyKeywordList = getKeywordsFromPolicy(document)
    if(!policyKeywordList.Empty){
      keywords.addAll(policyKeywordList)
    }
    // Add job number information.
    if (document.Job != null) {
      keywords.add(new Keyword(KeywordMap.jobnumber.Name, document.Job.JobNumber))
    }
    // Add user information.
    keywords.add(new Keyword(KeywordMap.user.Name, User.util.CurrentUser == null ? "" : User.util.CurrentUser.DisplayName))

    var archivalApp = new DocumentArchival()
    var docUID = archivalApp.archiveDocument(documentContents, document, keywords, asyncFolder, asyncSize)
    if (docUID != null && docUID != "0") {
      document.DocUID = docUID
      document.DMS = true
      document.DateCreated = DateUtil.currentDate()
      document.DateModified = DateUtil.currentDate()
    }
    return docUID
  }

  /**
   * Display document in OnBase Unity/Web client.
   *
   * @param document The document to be displayed.
   * @param includeDocumentContents If true includes document content. Currently not used by integration.
   *
   * @return The DocumentContentsInfo object for this document.
   */
  override function getDocumentContentsInfo(document: Document, includeDocumentContents: boolean): DocumentContentsInfo {
    return getDocumentContentsInformation(document, includeDocumentContents, _onbaseClientType, _onbaseWebClientType)
  }

  /**
   *   Add keywords based on policy info
   *
   *   @param document The document to be added.
   *   @return The policy related Keyword List this document.
   */
  private function getKeywordsFromPolicy(document: Document): List<Keyword> {
    var keywords = new ArrayList <Keyword>()

    // Add policy information.
    var period: PolicyPeriod = null

    if (document.PolicyPeriod != null) {
      period = document.PolicyPeriod
    } else if (document.Policy != null && document.Policy.Periods[0] != null) {
      period = document.Policy.Periods[0]
    }
    if (period != null) {
      keywords.add(new Keyword(KeywordMap.policynumber.Name, period.PolicyNumber))
      var primaryInsured = period.PrimaryNamedInsured
      keywords.add(new Keyword(KeywordMap.primarynamedinsureds.Name, new InsuredName(primaryInsured.FirstName, primaryInsured.LastName, primaryInsured.MiddleName)))

      var additionalNamedInsuredContacts = period.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)
      if (additionalNamedInsuredContacts.Count > 0) {
        additionalNamedInsuredContacts.each(\contact -> keywords.add(new Keyword(KeywordMap.additionalnamedinsureds.Name, new InsuredName(contact.FirstName, contact.LastName, contact.MiddleName))))
      }

      keywords.add(new Keyword(KeywordMap.productname.Name, document.Policy.Product.DisplayName))
      keywords.add(new Keyword(KeywordMap.policytype.Name, document.Policy.Product.Abbreviation))
      keywords.add(new Keyword(KeywordMap.agencycode.Name, period.ProducerCodeOfRecord.Organization.AgenyNumber_Ext))
      keywords.add(new Keyword(KeywordMap.legacypolicynumber.Name, period.LegacyPolicyNumber_Ext))
      keywords.add(new Keyword(KeywordMap.term.Name, period.TermType.Code))
      keywords.add(new Keyword(KeywordMap.policyexpirationdate.Name,period.PeriodEnd))
      keywords.add(new Keyword(KeywordMap.policyeffectivedate.Name, period.PeriodStart))
      keywords.add(new Keyword(KeywordMap.issuedate.Name, document.Policy.IssueDate))
      keywords.add(new Keyword(KeywordMap.transactioneffectivedate.Name, period.PeriodStart))
    }
    return keywords
  }

  /**
   * Open document in Unity or Web client.
   *
   * @param document The document to be opened.
   * @param includeDocumentContents If true then include document content. Currently not being used.
   * @param clientType The client type which the document to be opened in.
   * @param webClientType The web client type if using web client to open document.
   *
   * @return The DocumentContentInfo which contains the document URL.
   */
  function getDocumentContentsInformation(document: Document, includeDocumentContents: boolean, clientType: Settings.OnBaseClientType, webClientType: Settings.OnBaseWebClientType): DocumentContentsInfo {
    //    var retrievalApp = new DocumentRetrieval()
    //    var js = null as String
    //    var contents = null as String
    //    //dci's hidden frame is false by default.
    //    if (clientType == Settings.OnBaseClientType.Unity) {
    //     var uri = retrievalApp.getDocumentUnityURL(document.DocUID)
    //      contents= "<html><head><script>document.location.href='" + uri + "';</script></head></html>"
    //    } else {
    //       var uri = retrievalApp.getDocumentWebURL(document.DocUID, webClientType)
    //      js = "window.open('" + uri + "');"
    //      contents= "<html><head><script>" + js + "</script></head></html>"
    //    }
    //
    //    var dci = new DocumentContentsInfo(DocumentContentsInfo.DOCUMENT_CONTENTS, contents, "text/html")
    //    return dci

    var retrievalApp = new DocumentRetrieval()
    var uri = null as String
    var hiddenWindow = false
    if (clientType == Settings.OnBaseClientType.Unity) {
      //JavaScript is needed since they are not doing a hidden iframe but rather setting a href tag
      hiddenWindow = true;
      uri = "javascript:document.location.href='" + retrievalApp.getDocumentUnityURL(document.DocUID) + "'"
    } else {
      uri = retrievalApp.getDocumentWebURL(document.DocUID, webClientType)
    }
    var dci = DocumentContentsInfo.getDocumentContents(document.getDocUID(), "url", uri, null, null, null, hiddenWindow, includeDocumentContents)
    dci.setResponseMimeType("text/html")
    return dci
  }

  /**
   * Get the document content in OnBase for external use.
   *
   * @param document The document which content to be retrieved from OnBase.
   *
   * @return The DocumentContentsInfo object for this document.
   */
  override function getDocumentContentsInfoForExternalUse(document: Document): DocumentContentsInfo {
    var dci = new DocumentContentsInfo(DocumentContentsInfo.DOCUMENT_CONTENTS, getDocumentInputStream(document), document.getMimeType())
    return dci
  }

  /**
   * Get the document content input stream from OnBase.
   *
   * @param document The document to be downloaded.
   *
   * @return The document input stream.
   */
  function getDocumentInputStream(document: Document): InputStream {
    var retrievalApp = new DocumentRetrieval()
    var obDocument = DocumentConversion.convertGuidewireDocumentToOnBase(document)
    retrievalApp.getDocumentContent(obDocument)
    return obDocument.FileContent
  }

  /**
   * Is this a valid document?
   *
   * @param document The document to be checked.
   *
   * @return True if it is a valid document.
   */
  override function isDocument(document: Document): boolean {
    if (document.DocUID != null && !document.DocUID.equalsIgnoreCase("none")) {
      return true
    } else {
      return false
    }
  }

  /**
   * Remove document from OnBase.
   *
   * @param document The document to be deleted.
   *
   * @return false to delete the doc from gw and leave it as such on onbase.
   * @return True if document has been deleted
   */
  override function removeDocument(document: Document): boolean {
    //return true so that OnBaseDocumentMetadataSource won't be used
    //Note: if u want to update the keywords in OnBase then u have to do it HERE, before u return
    return false
    // logger.error("DocumentContentSource.removeDocument not implemented.")
    //throw new DisplayableException("DocumentContentSource.removeDocument not implemented.")
  }

  /**
   * Update document in OnBase. Store the document as a revision
   *
   * @param document The document to be updated.
   * @param documentIS The document content input stream.
   *
   * @return True if document has been updated.
   */
  override function updateDocument(document: Document, documentIS: InputStream): boolean {
    //## todo: Implement me
    //return true so that OnBaseDocumentMetadataSource won't be used
    logger.error("OnBaseDocumentContentSource.updateDocument not implemented.")
    throw new DisplayableException("OnBaseDocumentContentSource.updateDocument not implemented.")
  }

  /**
   * Update document in OnBase.
   *
   * @param documentContents The document content input stream.
   * @param document The document to be added to OnBase.
   * @param asyncFolder The async folder if using async document upload.
   * @param asyncSize The async size limit if using async document upload.
   *
   * @return The OLD document id or null if using async upload.
   */
  public function updateKeyword(documentContents: InputStream, document: Document, asyncFolder: File, asyncSize: long): String {
    var keywords = new ArrayList <Keyword>()
    // Add document account number.
    keywords.add(new Keyword(KeywordMap.accountnumber.Name, document.Account.AccountNumber))

    // Add document properties.
    keywords.add(new Keyword(KeywordMap.documentidforrevision.Name, document.DocUID))
    var oldDocHandle = document.DocUID
    var updateApp = new DocumentArchival()
    var docUID = updateApp.archiveDocument(documentContents, document, keywords, asyncFolder, asyncSize)
    if (docUID != null && docUID != "0") {
      document.DateCreated = DateUtil.currentDate()
      document.DateModified = DateUtil.currentDate()
    }
    return oldDocHandle
  }

  /**
   * Set plugin parameters.
   *
   * @param parameters The parameters for this plugin.
   */
  override function setParameters(parameters: Map <Object, Object>) {
    if (parameters != null) {
      if (parameters.containsKey("OnBaseClientType")) {
        var type = (parameters.get("OnBaseClientType") as String).trim()
        if (type.equalsIgnoreCase("Unity")) {
          _onbaseClientType = Settings.OnBaseClientType.Unity
        } else if (type.equalsIgnoreCase("Web")) {
          _onbaseClientType = Settings.OnBaseClientType.Web
        }
      }
      if (parameters.containsKey("OnBaseWebClientType")) {
        var type = (parameters.get("OnBaseWebClientType") as String).trim()
        if (type.equalsIgnoreCase("HTML")) {
          _onbaseWebClientType = Settings.OnBaseWebClientType.HTML
        } else if (type.equalsIgnoreCase("ActiveX")){
          _onbaseWebClientType = Settings.OnBaseWebClientType.ActiveX
        }
      }
      if (parameters.containsKey("AsyncDocumentSize") && parameters.containsKey("AsyncDocumentFolder")) {
        _asyncEnabled = true
        var size = (parameters.get("AsyncDocumentSize") as String).trim()
        // Get Async document size with K, KB, M, MB, G, GB suffix.
        try {
          if (size.endsWithIgnoreCase("k")) {
            _asyncDocumentSize = Long.parseLong((size.substring(0, size.length() - 1)).trim()) * 1000
          } else if (size.endsWithIgnoreCase("kb")) {
            _asyncDocumentSize = Long.parseLong((size.substring(0, size.length() - 2)).trim()) * 1000
          } else if (size.endsWithIgnoreCase("m")) {
            _asyncDocumentSize = Long.parseLong((size.substring(0, size.length() - 1)).trim()) * 1000000
          } else if (size.endsWithIgnoreCase("mb")) {
            _asyncDocumentSize = Long.parseLong((size.substring(0, size.length() - 2)).trim()) * 1000000
          } else if (size.endsWithIgnoreCase("g")) {
            _asyncDocumentSize = Long.parseLong((size.substring(0, size.length() - 1)).trim()) * 1000000000
          } else if (size.endsWithIgnoreCase("gb")) {
            _asyncDocumentSize = Long.parseLong((size.substring(0, size.length() - 2)).trim()) * 1000000000
          } else {
            _asyncDocumentSize = Long.parseLong(size)
          }
        } catch (ex: Exception) {
          logger.error("Error while parsing the 'AsyncDocumentSize' plugin paramter '" + size + "'", ex)
          throw new DisplayableException("Error while parsing the 'AsyncDocumentSize' plugin paramter '" + size + "' - " + ex)
        }
        // Get Async document folder and create folder if necessary.
        _asyncDocumentFolder = new File((parameters.get("AsyncDocumentFolder") as String).trim())
        try {
          _asyncDocumentFolder.mkdirs()
        } catch (ex: Exception) {
          logger.error("Unable to create Async Document Folder " + _asyncDocumentFolder, ex)
          throw new DisplayableException("Unable to create Async Document Folder " + _asyncDocumentFolder + " - " + ex)
        }
      }
      if (logger.DebugEnabled) {
        logger.debug("Async archive document with size >= " + _asyncDocumentSize + " and local folder = " + _asyncDocumentFolder)
      }
    }
    // Check parameter values and set them to default if necessary.
    if (_onbaseClientType == null) {
      logger.error("Invalid parameter 'OnBaseClientType', set it to default 'Unity'.")
      _onbaseClientType = Settings.OnBaseClientType.Unity
    }
    if (_onbaseWebClientType == null) {
      logger.error("Invalid parameter 'OnBaseWebClientType', set it to default 'HTML'.")
      _onbaseWebClientType = Settings.OnBaseWebClientType.HTML
    }
    if (_asyncDocumentSize == - 1 || _asyncDocumentFolder == null) {
      logger.error("Invalid parameter 'AsyncDocumentSize' or 'AsyncDocumentFolder'. Switching to SYNC upload as the default mode.")
      _asyncEnabled = false
    }
  }
}
