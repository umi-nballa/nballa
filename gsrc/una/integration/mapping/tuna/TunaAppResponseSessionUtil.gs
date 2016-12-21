package una.integration.mapping.tuna

uses java.util.concurrent.ConcurrentHashMap
uses java.lang.Exception
uses una.logging.UnaLoggerCategory

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 12/15/16
 * Time: 12:10 PM
 */
class TunaAppResponseSessionUtil {


    var logger = UnaLoggerCategory.UNA_PCFRULES

    /**
     * F
     */
    function getTunaAppFromSession(period: PolicyPeriod): TunaAppResponse {
      if (TunaAppResponseSession.UserSessionVar == null) {
        return null
      }
      else {
        var tunaAppObj = TunaAppResponseSession.UserSessionVar.get(period.Job.JobNumber)
        return tunaAppObj
      }
    }

    /**
     */
    function initializeSessionVar(period: PolicyPeriod, tunaApp: TunaAppResponse) {
      var tunaAppMap = new ConcurrentHashMap <String, TunaAppResponse>()
      try {
        tunaAppMap.put(period.Job.JobNumber, tunaApp)
        TunaAppResponseSession.UserSessionVar = tunaAppMap
       }
          catch (e: Exception) {
            logger.error("Error -exception: " + e.StackTraceAsString,this.IntrinsicType)
          }
      logger.debug("successfully initialized session var -TunaAppResponseSession.method:intialiseSessionVar().")
    }



  function removeFromSession(period: PolicyPeriod) {
    try {
      if (TunaAppResponseSession.UserSessionVar != null){
        TunaAppResponseSession.UserSessionVar.remove(period.Job.JobNumber)
      }
    }
        catch (e: Exception) {
          logger.error("Error  -exception: " +  e.StackTraceAsString, this.IntrinsicType)

        }
    logger.debug("Removing the Tuna App Object from session")
  }


}
