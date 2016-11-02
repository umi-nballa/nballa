package edge.PlatformSupport
uses java.lang.StringBuilder
uses gw.util.GosuStringUtil

class Logger {

  private var _logger = org.slf4j.LoggerFactory.getLogger("Edge")
  private var _classTag : String

  construct(classTag : String){
    _classTag = classTag
  }

  
  private function buildLogStringBuilder(msg:String, e:java.lang.Exception):StringBuilder {
    var builder = new StringBuilder()
    builder.append(_classTag)
    builder.append(" ")
    
    if(GosuStringUtil.isNotBlank(msg)) {
      builder.append(msg)
    }
    
    if(e != null) {
      builder.append(" ").append(Exception.stackTraceAsString(e))
    }
    
    return builder
  }
  
  public function logDebug(msg : String){
    if(debugEnabled()) {
      _logger.debug(buildLogStringBuilder(msg, null).toString())
    }
  }
  
  public function logDebug(e : java.lang.Exception){
    if(debugEnabled()) {
      _logger.debug(buildLogStringBuilder(null, e).toString())
    }
  }
  
  public function logDebug(msg : String, e : java.lang.Exception) {
    logDebug(msg)
    logDebug(e)
  }
  
  public function logInfo(msg : String){
    _logger.info(buildLogStringBuilder(msg, null).toString())
  }
  
  public function logInfo(e : java.lang.Exception){
    _logger.info(buildLogStringBuilder(null, e).toString())
  }
  
  public function logError(msg : String) {
    _logger.error(buildLogStringBuilder(msg, null).toString())
  }
  
  public function logError(e : java.lang.Exception) {
    _logger.error(buildLogStringBuilder(null, e).toString())
  }
  
  public function logError(msg : String, e : java.lang.Exception) {
    logError(msg)
    logError(e)
  }
  
  public function logWarn(msg : String) {
    _logger.warn(buildLogStringBuilder(msg, null).toString())
  }
  
  public function logWarn(e : java.lang.Exception) {
    _logger.warn(buildLogStringBuilder(null, e).toString())
  }
  
  public function logWarn(msg : String, e : java.lang.Exception) {
    logWarn(msg)
    logWarn(e)
  }
  public function debugEnabled() : Boolean{
    return _logger.DebugEnabled
  } 
}
