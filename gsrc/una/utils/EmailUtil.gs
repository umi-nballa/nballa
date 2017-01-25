package una.utils

uses java.lang.Exception
uses gw.api.system.server.ServerUtil
uses una.logging.UnaLoggerCategory

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 1/24/17
 * Time: 10:19 PM
 */
class EmailUtil {

  static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  public static function EmailAdminSupport(messageText:String) {
    try {
      var toEmailAddress =PropertiesHolder.getProperty("AdminSupportToEmail")
      var toName=PropertiesHolder.getProperty("AdminSupportToName")
      var fromName =PropertiesHolder.getProperty("AdminSupportFromName")
      var fromEmailAddress=PropertiesHolder.getProperty("AdminSupportFromEmail")
      var subject=PropertiesHolder.getProperty("AdminSupportSubject")  + "  -  " + ServerUtil.getEnv()
      var body= PropertiesHolder.getProperty("AdminSupportBody") +"        " + messageText
      gw.api.email.EmailUtil.sendEmailWithBody(null, toEmailAddress, toName, fromEmailAddress, fromName, subject, body)
    }
        catch(e : Exception) {
          _logger.error("Error sending email to PolicyCenter Admin Support  -EmailUtil.method:EmailAdminSupport() -exception: " +  e.toString())
        }
  }

}