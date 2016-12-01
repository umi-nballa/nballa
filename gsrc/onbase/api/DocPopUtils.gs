package onbase.api

uses java.lang.StringBuilder
uses gw.api.util.Logger

uses java.util.Map

uses org.apache.commons.lang.StringEscapeUtils
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 10/27/16
 * Time: 1:35 PM
 * To change this template use File | Settings | File Templates.
 */
class DocPopUtils {
  private static final var logger = Logger.forCategory("Document.OnBaseDMS")

  private static final var DocPopURL = ScriptParameters.OnBaseURL.toLowerCase() + "/docpop/docpop.aspx"

  /**
   * Url for DocPop
   *
   * @param queryString URL Query String
   *
   * @return string for DocPop uri
   */
  public static function getDocPopURL(queryString: String) : String{
    var uri =  DocPopURL + queryString
    if (logger.isDebugEnabled()) {
      logger.debug("Encoded Url is - " + uri)
    }
    return uri
  }

  public static function generateQueryString(keywordMap : Map<String, String>) : String {
    var queryString = new StringBuilder("?")
  /*  var mapping = new KeywordMapping()
    var seedID = -1;*/

    for (name in keywordMap.keySet() index i) {
      var id = name
//      var id = mapping.getKeywordIdFromName(name)
//      if(id == "-1"){ //If the keyword doesn't exist in OB, make the id negative and unique.
//        id = (seedID) as String
//        seedID--
//      }
      var value = StringEscapeUtils.escapeHtml(keywordMap.get(name))
      if(i != 0) {
        queryString.append("&")
      }
      queryString.append(id).append("=").append(value)
    }

    return queryString
  }

  /**
   * The Essentials to create a Custom Query URL
   *
   * @param keywordXml Keyword scrape xml that will be used to generate the document.
   * @param customQueryId Id of the OnBase Custom Query
   *
   * @return DocPop Custom Query URL
   */
  public static function generateCustomQueryURL(keywordMap: Map<String, String>, customQueryId:String) : String{

    return getDocPopURL(generateQueryString(keywordMap)+ "&clienttype=" + Settings.OnBaseWebClientType.HTML + "&cqid=" + customQueryId)
  }

  /**
   * The Essentials to create a DocPop Doc Retrieval URL
   *
   * @param docId Id Of Document that will be displayed
   *
   * @return DocPop URL for Doc Retrieval
   */
  public static function generateRetrievalUrl(docId: String):String{
    return getDocPopURL("?clientType=" + Settings.OnBaseWebClientType.HTML + "&docid=" + docId)
  }

}