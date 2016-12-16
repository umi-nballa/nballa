package una.integration.mapping.tuna

uses java.util.concurrent.ConcurrentHashMap
uses gw.api.web.SessionVar

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/15/16
 * Time: 12:09 PM
 */
class TunaAppResponseSession {

  /**********************************************************************************************
   * Tuna App response session
   **********************************************************************************************/

  /**
   * This class will be used to set and get the session variable. The type of session variable is
   * ConcurrentHashMap(its a thread safe map). This session variable is set when a user enters the
   * Dwelling/Dwelling Construction screen
   *
   * Session variable Type :  ConcurrentHashMap<String,TunaAppResponse>
   *
   */

  static var _varStoredInSession = new SessionVar<ConcurrentHashMap<String,TunaAppResponse>>()

  static property get UserSessionVar() :ConcurrentHashMap<String,TunaAppResponse> {
    if ( _varStoredInSession.RequestAvailable ) {
      return _varStoredInSession.get()
    }
    else {
      return null
    }
  }

  static property set UserSessionVar( tunaApp : ConcurrentHashMap<String,TunaAppResponse> ) {
    if ( _varStoredInSession.RequestAvailable ) {
      _varStoredInSession.set( tunaApp )
    }
    else {
      _varStoredInSession.set(null)
    }
  }


}