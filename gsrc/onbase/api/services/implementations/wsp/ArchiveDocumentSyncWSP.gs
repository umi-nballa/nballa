package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses onbase.api.Settings
uses onbase.api.services.datamodels.Keyword
uses onbase.api.services.implementations.wsp.util.KeywordAdaptor
uses onbase.api.services.interfaces.ArchiveDocumentSyncInterface
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.anonymous.elements.KeywordsArchiveDocument_Multi_Instance_Keyword_Group
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.anonymous.elements.KeywordsArchiveDocument_StandAlone
uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.ArchiveDocument
uses org.apache.commons.codec.binary.Base64

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
    archiveKeywords.Source_Collection.String[0] = Settings.CurrentCenter.Code + "center"
    archiveKeywords.GWFileName_Collection.String[0] = fileName
    archiveKeywords.DocumentType_Collection.String[0] = documentType
    archiveKeywords.AccountNumber_Collection.String[0] = adaptor.AccountNumber
    archiveKeywords.ClaimNumber_Collection.String[0] = adaptor.ClaimNumber
    archiveKeywords.GWDescription_Collection.String[0] = adaptor.Description
    archiveKeywords.DocumentIdForRevision_Collection.String[0] = adaptor.DocumentIdForRevision


    archiveKeywords.PolicyNumber_Collection.String[0] = adaptor.PolicyNumber
    archiveKeywords.ProducerID_Collection.String[0] = adaptor.ProducerID
    archiveKeywords.Recipient_Collection.String[0] = adaptor.Recipient
    archiveKeywords.Status_Collection.String[0] = adaptor.Status
    archiveKeywords.User_Collection.String[0] = adaptor.User
    if (adaptor.ClaimSecurityRole != null) {
      foreach (role in adaptor.ClaimSecurityRole.split(",") index i) {
        archiveKeywords.ClaimSecurityRole_Collection.String[i] = role
      }
    }
    archiveDocument.DocumentArchiveData.Keywords.StandAlone = archiveKeywords

    // MIKG keywords
    var archiveMIKGs = new KeywordsArchiveDocument_Multi_Instance_Keyword_Group()
    archiveMIKGs.Contact_Collection.Contact[0].ContactID = adaptor.ContactID
    archiveMIKGs.Contact_Collection.Contact[0].ContactName = adaptor.ContactName
    archiveMIKGs.Matter_Collection.Matter[0].MatterID = adaptor.MatterID
    archiveMIKGs.Matter_Collection.Matter[0].MatterName = adaptor.MatterName
    archiveMIKGs.Job_Collection.Job[0].JobNumber = adaptor.JobNumber
    var index = 0
    if (adaptor.ActivityID != null) {
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkType = Settings.DocumentLinkType.activityid.toString()
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkID = adaptor.ActivityID
      index++
    }
    if (adaptor.CheckID != null) {
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkType = Settings.DocumentLinkType.checkid.toString()
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkID = adaptor.CheckID
      index++
    }
    if (adaptor.ReserveID != null) {
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkType = Settings.DocumentLinkType.reserveid.toString()
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkID = adaptor.ReserveID
      index++
    }
    if (adaptor.ExposureID != null) {
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkType = Settings.DocumentLinkType.exposureid.toString()
      archiveMIKGs.GWLink_Collection.GWLink[index].GWLinkID = adaptor.ExposureID
      index++
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
