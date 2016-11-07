package edge.capabilities.document
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse
uses java.lang.IllegalArgumentException
uses edge.security.authorization.exception.AuthorizationException
uses gw.document.DocumentContentsInfo
uses java.io.ByteArrayOutputStream
uses java.io.InputStream
uses java.io.OutputStream
uses gw.api.util.Logger
uses javax.servlet.ServletException
uses edge.capabilities.document.exception.DocumentRetrievalException
uses edge.capabilities.document.local.IDocumentSessionPlugin
uses edge.capabilities.document.local.IDocumentContentPlugin
uses edge.di.annotations.InjectableNode
uses edge.jsonrpc.exception.JsonRpcInvalidRequestException
uses edge.capabilities.document.util.DocumentUtil

/**
 * Implementation of Document Retrieval Handler.
 */
class DocumentRetrievalHandler implements IDocumentRetrievalHandler{
  
  private static final var TRANSFER_BUFFER_SIZE : int = 4096 //Size of the buffer used to send the document data back to the client
  private static final var LOGGER = Logger.forCategory(DocumentRetrievalHandler.Type.QName)

  private var _sessionPlugin : IDocumentSessionPlugin
  private var _contentPlugin : IDocumentContentPlugin

  @InjectableNode
  construct(sessionPlugin : IDocumentSessionPlugin, contentPlugin : IDocumentContentPlugin) {
    this._sessionPlugin = sessionPlugin
    this._contentPlugin = contentPlugin
  }

  function doGet(req : HttpServletRequest, resp : HttpServletResponse) {
    try {
      
      LOGGER.debug("Processing document")
      if (!_sessionPlugin.isSessionValid(req.getParameter("token"))) {
        throw new AuthorizationException(){:Message = "Unauthorized portal access"}
      }

      var docID = retrieveDocumentID(req)
      LOGGER.debug("Processing document id " + docID)
      
      var doc = DocumentUtil.getDocumentByPublicId(docID)
      var docContent = _contentPlugin.getDocumentContent(docID)
      
      try {
        switch(docContent.ResponseType) {
          case DocumentContentsInfo.DOCUMENT_CONTENTS:          
            resp.setContentType(docContent.ResponseMimeType)
            resp.setHeader("Content-Disposition", "attachment; filename="+doc.Name)
            copyStream(docContent.InputStream, resp.OutputStream)
            break;
          
          case DocumentContentsInfo.URL:
            var urlBuffer = new ByteArrayOutputStream()
            copyStream(docContent.InputStream, urlBuffer)
            resp.sendRedirect(urlBuffer.toString())
            break
          
          default:
            // Only DOCUMENT_CONTENTS or URL ResponseType is allowed for values returned 
            // from IDocumentContentPlugin.getDocumentContentsInfoForExternalUse 
            var msg = "Unexpected document content type: ${docContent.ResponseType}"
            LOGGER.error("#doGet(HttpServletRequest,HttpServletResponse) - ${msg}")
            throw new ServletException(msg)
        }
      } finally {
        if ( docContent.InputStream != null ) {
          docContent.InputStream.close() 
        }
      }
    } catch(e:DocumentRetrievalException) {
      // Absolute error page URL will be '/pc/service/document/<error page>' (for PC 7)
      LOGGER.error("Error retrieving document form the DocumentPlugin - ${e.Message}:${e.Code}", e)
      var redirect = req.getParameter("portalRoute")
      resp.sendRedirect(redirect+".html"/*e.Code.ErrorUrl*/)
    } catch(e:JsonRpcInvalidRequestException) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST)
    } catch(e:AuthorizationException) {
      LOGGER.info(e.Message)
      resp.sendError(HttpServletResponse.SC_UNAUTHORIZED)
    }
  }

  /**
   * Retrieves the document ID for the current servlet request.
   * Throws JsonRpcInvalidParamsException
   */
  @Param("req", "Document request received")
  @Throws(JsonRpcInvalidRequestException,"If the request is not a valid document request")
  private function retrieveDocumentID(req:HttpServletRequest) : String {
    var params = req.PathInfo.split("/")
    
    var docId = params.HasElements ? params.last() : null
    if ( params.length < 2 || !docId.HasContent ) {
      throw new IllegalArgumentException("Invalid document request received: ${req.PathInfo}")
    }
    return docId
  }
  
    /**
   * Copies the input stream to the output stream using a temporary buffer
   */
  @Param("is", "The source stream")
  @Param("os", "The destination stream")
  private function copyStream(is:InputStream, os:OutputStream)     {
    var buffer = new byte[TRANSFER_BUFFER_SIZE]
    var cnt = 0
    do {
      cnt = is.read(buffer)
      if (cnt > 0) {
        os.write(buffer, 0, cnt)
      }
    } while( cnt > 0 )
    os.flush()
  }


}
