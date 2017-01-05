package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses onbase.api.Settings
uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.implementations.wsp.util.KeywordAdaptor
uses onbase.api.services.interfaces.ArchiveDocumentSyncInterface
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.anonymous.elements.KeywordsArchiveDocument_Multi_Instance_Keyword_Group
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.anonymous.elements.KeywordsArchiveDocument_StandAlone
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.ArchiveDocument
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.AdditionalInsured
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.PrimaryInsured
uses org.apache.commons.codec.binary.Base64
uses java.io.File
uses java.lang.Exception
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.ArchiveDocumentResponse
uses java.lang.Long
uses java.text.SimpleDateFormat

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/30/2015 - dlittleton
 *     * Initial implementation.
 *
 *   01/27/2016 - Daniel Q. Yu
 *     * Added Keyword claimsecurityrole.
 *
 *   03/10/2016 - Daniel Q. Yu
 *     * Use MIKG instand standalone so that no workflow action needed.
 *
 *   04/26/2016 - Richard R. Kantimahanthi
 *     * Reinstating broken functionality set in SCR#215219 (use GW Link MIKG when archiving a document related to an Exposure).
 *
 *   05/20/2016 - Anirudh Mohan
 *     * Added Document Handle to archiveKeywords
 *
 *   06/09/2016 - Anirudh Mohan
 *     * Replaced Document Handle with DocumentIdForRevision
 *     * Updated GWLink as a MIKG and renamed GWLinkTypeBackup,GWLinkIDBackup to GWLinkType and GWLinkID respectively
 */
/**
 * Implementation of the ArchiveDocumentSync interface using WSP.
 */
class ArchiveDocumentSyncWSP implements ArchiveDocumentSyncInterface {
  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  /**
   * Archive document synchronously.
   *
   * @param documentContents The document content in bytes.
   * @param fileName The document original file name.
   * @param documentType The document type.
   * @param mimeType The document MIME type.
   * @param keywords The keyword values for this document.
   *
   * @return The newly archived document id.
   */
  public override function archiveDocument(documentContents: byte[], fileName: String, documentType: String, mimeType: String, keywords: List <Keyword>): String {
    logger.debug("Start executing archiveDocument() using WSP service.")

    // Build query (Soap 1.1)
    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()

    var base64Content = Base64.encodeBase64String(documentContents)

    var archiveDocument = new ArchiveDocument()

    // File information
    archiveDocument.DocumentArchiveData.FileInfo.MIMEType = mimeType
    archiveDocument.DocumentArchiveData.FileInfo.Base64FileStream = base64Content
    // Create keyword adaptor
    var adaptor = new KeywordAdaptor(keywords)

    // Standalone Keywords
    var archiveKeywords = new KeywordsArchiveDocument_StandAlone()

    archiveKeywords.AgencyCode_Collection.String[0] = adaptor.AgencyCode
    archiveKeywords.Description_Collection.String[0] = adaptor.Description
    archiveKeywords.LegacyPolicyNumber_Collection.String[0] = adaptor.LegacyPolicyNumber
    archiveKeywords.OnBaseDocumentType_Collection.String[0] = documentType
    archiveKeywords.PolicyEffectiveDate_Collection.String[0] = adaptor.PolicyEffectiveDate
    archiveKeywords.PolicyExpirationDate_Collection.String[0] = adaptor.PolicyExpirationDate
    archiveKeywords.PolicyNumber_Collection.String[0] = adaptor.PolicyNumber
    archiveKeywords.PolicyType_Collection.String[0] = adaptor.PolicyType
    archiveKeywords.ProductName_Collection.String[0] = adaptor.ProductName
    archiveKeywords.ReceivedDate_Collection.String[0] = adaptor.ReceivedDate
    archiveKeywords.Source_Collection.String[0] = Settings.CurrentCenter.Code + "center"
    archiveKeywords.Subtype_Collection.String[0] = adaptor.Subtype
    archiveKeywords.Term_Collection.String[0] = adaptor.Term
    archiveDocument.DocumentArchiveData.Keywords.StandAlone = archiveKeywords

    // MIKG keywords
    var archiveMIKGs = new KeywordsArchiveDocument_Multi_Instance_Keyword_Group()
    if(!adaptor.PrimaryNamedInsureds.Empty) {
      archiveMIKGs.PrimaryInsured_Collection.PrimaryInsured = new List<PrimaryInsured>()
      for(namedInsured in adaptor.PrimaryNamedInsureds index i) {
        var primaryInsured = new PrimaryInsured()
        primaryInsured.PrimaryInsuredName= namedInsured.FirstName
        primaryInsured.PrimaryMiddleName = namedInsured.MiddleName
        primaryInsured.PrimaryLastName = namedInsured.LastName
        archiveMIKGs.PrimaryInsured_Collection.PrimaryInsured.add(primaryInsured)
      }
    }

    if(!adaptor.AdditionalNamedInsureds.Empty) {
      archiveMIKGs.AdditionalInsured_Collection.AdditionalInsured = new List<AdditionalInsured>()
      for(namedInsured in adaptor.AdditionalNamedInsureds index i) {
        var addNamedInsured = new AdditionalInsured()
        addNamedInsured.AdditionalFirstName = namedInsured.FirstName
        addNamedInsured.AdditionalMiddleName = namedInsured.MiddleName
        addNamedInsured.AdditionalLastName = namedInsured.LastName
        archiveMIKGs.AdditionalInsured_Collection.AdditionalInsured.add(addNamedInsured)
      }
    }
    archiveDocument.DocumentArchiveData.Keywords.Multi_Instance_Keyword_Group = archiveMIKGs

    // Make request
    var response = service.ArchiveDocument(archiveDocument)
    if (logger.isDebugEnabled()) {
      logger.debug("Finished executing archiveDocument() using WSP service with document ID: ${response}")
    }

    return response.toString()
  }
}
