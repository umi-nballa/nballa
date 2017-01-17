package una.enhancements.entity

uses onbase.api.pluginimpl.DocumentContentSource
uses onbase.api.services.ServicesManager
uses onbase.api.services.datamodels.OnBaseDocument

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 1/10/17
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement EmailEnhancement : gw.api.email.Email {

  function addDocumentFromOnBase(document: Document) {
    if(document != null && document.DMS &&document.DocUID?.HasContent) {
      /** Services Manager */
      var servicesManager = new ServicesManager()
      var obDoc = new OnBaseDocument()
      obDoc.DocID = document.DocUID
      servicesManager.getDocumentContent(obDoc)
      //obDoc.FileContent
      var docContentSrc = new DocumentContentSource()
      docContentSrc.getDocumentInputStream(document)
      var dci = docContentSrc.getDocumentContentsInfo(document, true)
      this.addDocument(document)
    }
  }
}
