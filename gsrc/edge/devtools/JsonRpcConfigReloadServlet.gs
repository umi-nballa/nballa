package edge.devtools

uses javax.servlet.http.HttpServlet
uses gw.servlet.Servlet
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse
uses java.lang.Throwable
uses edge.servlet.HandlerInfoLookup

/**
 * Servlet for reloading edge JsonRpcServlets (and other edge configuration data).
 */
@Servlet("/edge-dev/reload-config")
class JsonRpcConfigReloadServlet extends HttpServlet {
  override function doGet(req : HttpServletRequest, resp : HttpServletResponse) {
    resp.setCharacterEncoding("UTF-8")
    resp.setContentType("text/plain")
    CacheHeaderUtil.setNoCache(resp)

    try {
      final var status = HandlerInfoLookup.reloadHandlerConfiguration()
      if (status.isLeft) {
        resp.Writer.println("FAILED TO RELOAD CONFIGURATION")
        status.left.each( \ elt -> resp.Writer.println(elt))
      } else {
        resp.Writer.println("RELOADING DONE")
        resp.Writer.println("Document handlers: " + status.right.DocumentHandlerCount)
        resp.Writer.println("JsonRpc handlers: " + status.right.JsonRpcHandlerCount)
      }
    } catch (e : Throwable) {
      resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
      resp.Writer.println("FATAL RELOADING ERROR:")
      e.printStackTrace(resp.Writer)
    }
  }
}
