package una.utils

uses una.logging.UnaLoggerCategory
uses gw.plugin.document.IDocumentContentSource
uses gw.plugin.Plugins
uses gw.transaction.Transaction
uses java.io.FileInputStream
uses una.model.DocumentDTO
uses java.lang.IllegalArgumentException
uses java.io.File
uses org.apache.tika.Tika
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 2/27/17
 * Time: 12:30 PM
 * To change this template use File | Settings | File Templates.
 */
class DocumentUtil {
  final static var LOGGER = UnaLoggerCategory.INTEGRATION

  @Throws(java.lang.IllegalArgumentException, "If DocumentDTO, File, OnBaseDocumentType, or policy and account are null, will throw IllegalArgumentException")
  static function createDocument(docDTO: DocumentDTO): Document {

    var doc: Document = null

    if(docDTO == null || (docDTO.Policy == null && docDTO.Account == null) || docDTO.File == null || docDTO.OnBaseDocumentType == null) {
       throw new IllegalArgumentException("Not enough information was provided to create document.")
    }

    var inputStream : FileInputStream
    try {
      var docContentSource =  Plugins.get("IDocumentContentSource") as IDocumentContentSource
      Transaction.runWithNewBundle(\bundle -> {
        doc = new Document()
        bundle.add(doc)
        doc.DateCreated = new Date()
        doc.Account = docDTO.Account != null ? docDTO.Account : docDTO.Policy.Account
        doc.Policy = docDTO.Policy
        doc.PolicyPeriod = docDTO.Policy?.LatestPeriod
        doc.Name = docDTO.File.Name
        doc.Description = docDTO.Description
        doc.OnBaseDocumentType = docDTO.OnBaseDocumentType
        doc.OnBaseDocumentSubtype = docDTO.OnBaseDocumentSubype
        doc.MimeType = getMimeType(docDTO.File)
        doc.Status = typekey.DocumentStatusType.TC_APPROVED
        doc.Type = typekey.DocumentType.TC_ONBASE
        doc.DMS = true
        //  Archive file with DMS
        inputStream = new FileInputStream(docDTO.File)
        docContentSource.addDocument(inputStream, doc)
      }, User.util.UnrestrictedUser)
    } finally {
      inputStream.close()
    }

    return doc
  }

  private static function getMimeType(file: File): String  {
    var mimeType = ""
    var tika = new Tika()
    mimeType = tika.detect(file)
    return mimeType
  }

}