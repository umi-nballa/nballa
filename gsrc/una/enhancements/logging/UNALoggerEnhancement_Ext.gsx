package una.enhancements.logging

uses java.lang.Throwable

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/4/16
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNALoggerEnhancement_Ext : gw.util.ILogger {
  public function debugIfEnabled(message : String){
    if(this.DebugEnabled){
      this.debug(message)
    }
  }

  public function debugIfEnabled(message : String, throwable : Throwable){
    if(this.DebugEnabled){
      this.debug(message, throwable)
    }
  }
}
