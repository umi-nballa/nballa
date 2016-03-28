package gw.lob.common.util

uses org.apache.http.impl.client.DefaultHttpClient
uses org.apache.http.client.methods.HttpGet
uses java.io.File
uses java.io.FileOutputStream
uses java.net.URI
uses org.apache.http.util.EntityUtils
uses org.apache.http.client.methods.HttpHead
uses java.util.Date
uses org.apache.http.client.methods.HttpRequestBase
uses org.apache.http.impl.cookie.DateUtils

class Http {
  var _uri : URI

  construct(uri : URI) {
    _uri = uri
  }

  function downloadTo(file : File) {
    if (file.exists() and
        file.lastModified() > getLastModified().Time) {
      return
    }
    file.ParentFile.mkdirs()

    var content = get()
    using(var stream = new FileOutputStream(file)) {
      stream.write(content.getBytes("ISO-8859-1")) // TODO: ALEX: Make this UTF-8
    }
  }

  function get() : String {
    var client = new DefaultHttpClient()
    var httpGet = new HttpGet(_uri)

    addDefaultGWCredentials(httpGet)

    var response = client.execute(httpGet)
    if(response.StatusLine.StatusCode != 200) {
      throw response.StatusLine.ReasonPhrase
    }

    return EntityUtils.toString(response.Entity, "ISO-8859-1"); // TODO: ALEX: make this UTF-8
  }

  function getLastModified() : Date {
    var client = new DefaultHttpClient()
    var httpHead = new HttpHead(_uri)

    addDefaultGWCredentials(httpHead)

    var response = client.execute(httpHead)
    if(response.StatusLine.StatusCode != 200) {
      throw response.StatusLine.ReasonPhrase
    }

    var header = response.getHeaders("Last-Modified")[0]

    return DateUtils.parseDate( header.Value )
  }

  private function addDefaultGWCredentials(httpRequest : HttpRequestBase) {
    httpRequest.setHeader("Authorization", "Basic c3U6Z3c=")
  }
}