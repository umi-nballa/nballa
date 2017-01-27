package una.utils

uses java.lang.Exception
uses gw.api.system.server.ServerUtil
uses una.logging.UnaLoggerCategory
uses gw.api.email.EmailContact
uses gw.api.email.Email

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 1/24/17
 * Time: 10:19 PM
 */
class EmailUtil {
  static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  private static final var CLASS_NAME = EmailUtil.Type.DisplayName


  /**
   * Function to send email to support team
   */

  public static function EmailAdminSupport(messageText: String) {
    _logger.info(CLASS_NAME + " :: " + " Sending Email to Admin Support")
    try {
      var toEmailAddress = PropertiesHolder.getProperty("AdminSupportToEmail")
      var toName = PropertiesHolder.getProperty("AdminSupportToName")
      var fromName = PropertiesHolder.getProperty("AdminSupportFromName")
      var fromEmailAddress = PropertiesHolder.getProperty("AdminSupportFromEmail")
      var subject = PropertiesHolder.getProperty("AdminSupportSubject") + "  -  " + ServerUtil.getEnv()
      var body = PropertiesHolder.getProperty("AdminSupportBody") + " " + messageText
      gw.api.email.EmailUtil.sendEmailWithBody(null, toEmailAddress, toName, fromEmailAddress, fromName, subject, body)
      _logger.info(CLASS_NAME + " :: " + " Email Sent to Admin Support")
    }
        catch (e: Exception) {
          _logger.error("Error sending email to PolicyCenter Admin Support  -EmailUtil.method:EmailAdminSupport() -exception: " + e.toString())
        }
  }

  /**
   * Function to send email
   */
  public static function sendEmail(messageText: String, recipients: EmailContact, subject: String) {
    _logger.info(CLASS_NAME + " :: " + " Sending Email")
    try {
      var emailSenderContact = new EmailContact()
      emailSenderContact.setEmailAddress(PropertiesHolder.getProperty("EMAIL_Sender_Address"))
      emailSenderContact.setName(PropertiesHolder.getProperty("EMAIL_Sender_Name"))

      if(ServerUtil.Env != "prd")
      subject = subject + "_" + ServerUtil.Env

      var email = new Email(recipients, emailSenderContact, subject, messageText)

      gw.api.email.EmailUtil.sendEmailWithBody(null, email)
      _logger.info(CLASS_NAME + " :: " + " Email Sent")
    } catch (e: Exception) {
      _logger.error(CLASS_NAME + " :: " + "Sending Email Failed : " + e.StackTraceAsString)
    }
  }
}