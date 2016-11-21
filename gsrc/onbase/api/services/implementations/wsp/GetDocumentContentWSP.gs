package onbase.api.services.implementations.wsp

uses gw.api.util.Logger

uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.services.interfaces.GetDocumentContentInterface
uses onbase.api.Settings

uses onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.elements.GetDocumentContent

uses org.apache.commons.codec.binary.Base64InputStream
uses org.apache.commons.io.IOUtils

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   02/09/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the GetDocumentContent interface using WSP.
 */
class GetDocumentContentWSP implements GetDocumentContentInterface {

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)


  /**
   * Get document content from OnBase. The content can be retrieved from document.FileContent input stream after this call.
   *
   * @param document The OnBase document.
   */
  public override function getDocumentContent(document: OnBaseDocument) {
    logger.debug("Start executing getDocumentContent() using WSP service.")

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()

    var contentRequest= new GetDocumentContent()
    contentRequest.DocumentData.DocumentHandle = document.DocID as String

    var response = service.GetDocumentContent(contentRequest)
    var contents = response.GetDocumentContentResult.Base64FileStream
    document.FileContent = new Base64InputStream(IOUtils.toInputStream(contents))
    document.FileExtension = response.GetDocumentContentResult.Extension

    logger.debug("Finished executing getDocumentContent() using WSP service")
  }

}
