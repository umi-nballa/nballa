package onbase.api.services.implementations.direct

uses gw.api.util.Logger
uses gw.xml.ws.AsyncResponse
uses gw.xml.ws.WebServiceException
uses gw.xml.ws.WsdlFault
uses gw.xsd.w3c.soap11_envelope.Envelope
uses onbase.api.Settings
uses onbase.api.exception.ServiceErrorCodeException
uses onbase.api.exception.ServicesTierException
uses onbase.api.exception.ServicesTierServerConnectionException
uses onbase.api.exception.ServicesTierServerErrorException
uses onbase.api.services.datamodels.OnBaseDocument
uses onbase.api.services.interfaces.GetDocumentContentInterface
uses onbase.api.services.implementations.direct.webservicecollection.onbasedocumentinterfaceforgw.getdoc.elements.FileDownload
uses onbase.api.services.implementations.direct.webservicecollection.onbasedocumentinterfaceforgw.getdoc.elements.FileRequest

uses javax.crypto.Mac
uses javax.crypto.spec.SecretKeySpec
uses javax.xml.namespace.QName
uses java.io.InputStream

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/14/2015 - Daniel Q. Yu
 *     * Initial implementation.
 *
 *   01/27/2015 - Clayton Sandham
 *     * Initial error handling implementation.
 *
 *   01/30/2015 - Daniel Q. Yu
 *     * Added stats tracking.
 *
 *   02/12/2015 - Richard R. Kantimahanthi
 *     * modified code to throw a 'ServicesTierServerConnectionException' in case of a HTTP 500 response from the service.
 */
/**
 * Implementation to call OnBase GetDoc service using EIS.
 */
class GetDocumentContentEIS implements GetDocumentContentInterface {
  /** Logger. */
  private var logger = Logger.forCategory(Settings.ServicesLoggerCategory)
  /**
   * Get document content from OnBase. The content can be retrieved from document.FileContent input stream after this call.
   *
   * @param document The OnBase document.
   */
  override function getDocumentContent(document: OnBaseDocument) {
    if (logger.isDebugEnabled()) {
      logger.debug("Start executing GetDocumentContentEIS.getDocumentContent() using EIS service.")
    }
    var inStream: InputStream = null
//    var key = (ScriptParameters.getParameterValue("OnBaseHashKey")as String).trim()
    var key = (ScriptParameters.OnBaseHashKey).trim()
    //build the hash code.
    var secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256")
    var mac = Mac.getInstance("HmacSHA256")
    mac.init(secretKey)
    var hmacData = mac.doFinal(("" + document.DocID).getBytes())
    var hash = gw.util.Base64Util.encode(hmacData)
    //instantiate the streaming service.
    var streamingService = new onbase.api.services.implementations.direct.webservicecollection.onbasedocumentinterfaceforgw.getdoc.GetDoc()
    var fileRequest = new FileRequest()
    fileRequest.DocID = java.lang.Long.toString(document.DocID)
    fileRequest.Hash = hash
    //send request to the streaming service.
    var response: AsyncResponse <FileDownload, Envelope>
    try {
      response = streamingService.async_GetData(fileRequest)
      var qn = new QName("http://tempuri.org/", "Status");
      if (response.ResponseEnvelope.Header.getChild(qn).Text.containsIgnoreCase("Document retrieval failed"))
      {
        throw new ServiceErrorCodeException("Failure to retrieve document contents from OnBase")
      }
    } catch (ex: WebServiceException) {
      logger.error("Exception occured in GetDocumentContentEIS.getDocumentContent(): " + ex.Message)
      if (ex.Message.contains("HTTP Response Code 500")) {
        throw new ServicesTierServerConnectionException("Server error while attempting to retrieve Document contents from OnBase", ex)
      } else {
        throw new ServicesTierException("Failure to retrieve document contents from OnBase", ex)
      }
    } catch (ex2: WsdlFault) {
      logger.error("Exception occured in GetDocumentContentEIS.getDocumentContent(): " + ex2.Message)
      throw new ServicesTierServerErrorException("WSDL Fault while attempting to retrieve Document contents from OnBase", ex2)
    }
    var qn = new QName("http://tempuri.org/", "Status");
    if (response.ResponseEnvelope.Header.getChild(qn).Text.equalsIgnoreCase("Success")) {
      inStream = response.get().FileContents.InputStream
      if (inStream == null) {
        logger.error("No streaming content available for the document selected docID: '" + document.DocID + "'")
        throw new ServicesTierException("No streaming content available for the document selected docID: '" + document.DocID + "'")
      }
      var ext = response.ResponseEnvelope.Header.getChild(new QName("http://tempuri.org/", "FileExtension")).Text
      document.FileExtension = ext
      document.FileContent = inStream
    } else {
      logger.error("Could not download the file stream from OnBase - " + response.ResponseEnvelope.Header.getChild(qn).Text)
      throw new ServicesTierException("Could not download the file stream from OnBase - " + response.ResponseEnvelope.Header.getChild(qn).Text)
    }
    if (logger.isDebugEnabled()) {
      logger.debug("Finish executing GetDocumentContentEIS.getDocumentContent() using EIS service.")
    }
  }
}
