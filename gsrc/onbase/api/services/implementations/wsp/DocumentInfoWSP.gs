package onbase.api.services.implementations.wsp

uses gw.api.util.Logger
uses gw.xml.XmlElement
uses gw.xml.XmlSimpleValue

uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.services.interfaces.DocumentInfoInterface
uses onbase.api.Settings

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/30/2015 - dlittleton
 *     * Initial implementation.
 */

/**
 * Implementation of the DocumentInfo interface using WSP.
 *
 * Note that this service call makes use of a Unity Script. Script responses
 * are not represented in the WSDL, so some manual Xml parsing is used.
 */
//TODO: REMOVE THIS CLASS?
class DocumentInfoWSP implements DocumentInfoInterface {

  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)

  /**
   * Get the document information for a document.
   *
   * @param docId The document id.
   *
   * @return The OnBase document for this document id.
   */
  public override function getDocumentInfo(docId: long): OnBaseDocument {
    logger.debug("Start executing getDocumentInfo() using WSP service.")

    var service = new onbase.api.services.implementations.wsp.webservicecollection.onbaseinterfacewsp.soapservice.ports.EISClientWithConfig_BasicHttpBinding_HylandOutBoundContract()
    var docInfoRequest = new DocumentInfoRequest(docId)
  //TODO: OnBase - commented out awaiting taxonomy
/*    var response = service.GetDocumentInfo(docInfoRequest.toString())
    var docInfoResponse = new DocumentInfoResponse(response)*/

    var result = new OnBaseDocument()
//TODO: OnBase - commented out awaiting taxonomy
/*    result.DocID = docId
    result.Name = docInfoResponse.Name
    result.MimeType = docInfoResponse.MimeType*/

    logger.debug("Finished executing getDocumentInfo() using WSP service.")
    return result
  }

  /**
   * Helper class to properly format the request as Xml
   */
  private class DocumentInfoRequest {
    private var _xml : XmlElement

    construct(docId: long) {
      _xml = new XmlElement("DocID")
      _xml.SimpleValue = XmlSimpleValue.makeStringInstance(docId as String)
    }

    public override function toString() : String {
      return _xml.asUTFString()
    }
  }

  /**
   * Helper class to parse the Xml response
   */
  private class DocumentInfoResponse {

    private var _xml : XmlElement

    construct(xmlString : String) {
      _xml = XmlElement.parse(xmlString)
    }

    property get Name() : String {
      return _xml.getChild("Name").SimpleValue.StringValue
    }

    property get MimeType() : String {
      return _xml.getChild("MimeType").SimpleValue.StringValue
    }

  }

}
