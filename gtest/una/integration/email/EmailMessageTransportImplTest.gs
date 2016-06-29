package una.integration.email

uses una.integration.UnaIntTestBase
uses una.integration.plugins.email.EmailMessageTransportImpl
uses gw.api.email.Email
uses gw.api.email.EmailContact
uses una.logging.UnaLoggerCategory
uses java.util.Properties
uses javax.mail.Session
uses javax.mail.internet.MimeMessage
uses javax.mail.internet.InternetAddress

uses javax.mail.MessagingException
uses java.lang.System
uses javax.mail.Message
uses javax.mail.Transport

/**
 * Purpose of this test class is to email integration functionality
 * User: amohammed
 * Date: 6/23/16
 * Time: 9:51 AM
 */
class EmailMessageTransportImplTest extends UnaIntTestBase {
  static var emailMsgTransport : EmailMessageTransportImpl
  final static var logger = UnaLoggerCategory.TEST

  /**
   * This method is used to initialize the test data common for all the tests in this class
   */
  override function beforeClass() {
    super.beforeClass()
    logger.info("Initializing EmailMessageTransportImpl")
    //authPlugin.setCallback(new LoginServiceAuthenticationServicePluginCallbackHandler())
  }

  /**
   * This method is used to free up of resources initialized in the beforeClass() method
   */
  override function afterClass() {
    logger.info("Dereferencing the EmailMessageTransportImpl")
    emailMsgTransport = null
    super.afterClass()
  }

  /**
   * Tests the creation of email and sending it to smtp exchange server
   * Used authentication credentials as akreci and Password1$
   */
  function testCreateHtmlEmail() {
    logger.info("Entering the test method 'testCreateHtmlEmail()'")
    var smtpProperties = loadSmtpProperties()
   //Set EmailContact as Sender
    var emailSenderContact = new EmailContact()
    emailSenderContact.setEmailAddress(smtpProperties.getProperty("from"))
    emailSenderContact.setName("Test Sender")

    //Set EmailContact as Recipient
    var emailRecipientContact = new EmailContact()
    emailRecipientContact.setEmailAddress(smtpProperties.getProperty("to"))
    emailRecipientContact.setName("Test Recipient")

    var email = new Email(emailSenderContact, emailRecipientContact)
    email.setSubject("Test email ")

    emailMsgTransport = new EmailMessageTransportImpl()
    var out = emailMsgTransport.createHtmlEmail(smtpProperties.getProperty("mail.smtp.host"),
        smtpProperties.getProperty("mail.smtp.port"), email)

    assertNotNull("Out Object successfully created", out)
    logger.info("Exiting the test method 'testCreateHtmlEmail'")
  }

  /**
   * Tests the creation of email and sending it to smtp exchange server
   */
  function testCreateEmailAndSend() {
    logger.info("Entering the test method 'testCreateEmailAndSend()'")
     var smtpProperties = loadSmtpProperties()
     smtpProperties = loadSmtpProperties()
    var exceptionOccured = false
    //Authentication used for una smtp server
    var authenticator  = new javax.mail.Authenticator() {
      protected override property get PasswordAuthentication() : javax.mail.PasswordAuthentication{
        return new javax.mail.PasswordAuthentication(smtpProperties.getProperty("mail.smtp.user"),
            smtpProperties.getProperty("mail.smtp.password"));
      }
    };

    // session with properties and authenticator
    var sessionObj = Session.getDefaultInstance(smtpProperties, authenticator)

    try {
      var message = new MimeMessage(sessionObj)
      message.setFrom(new InternetAddress(smtpProperties.getProperty("from")))
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(smtpProperties.getProperty("to")))
      message.setSubject("Test Email sent from Unit Test Case")
      message.setText("Email sent from test case plan")
      Transport.send(message)
      assertFalse(exceptionOccured)
      logger.debug("Message sent successfully...")
    }catch (e : MessagingException) {
      exceptionOccured = true
      logger.debug("Exception occured " + e.getMessage())
      assertTrue(exceptionOccured)
      e.printStackTrace()
    }finally{
      smtpProperties = null
      emailMsgTransport = null
    }
    logger.info("Exiting the test method 'testCreateEmailAndSend'")
  }

  /**
   * Purpose of this method is to load the smtp properties
   */
  function loadSmtpProperties() : Properties {
    var props = new Properties()
    props.put("mail.smtp.host", "uimgwexchange01.uicna.local")
    props.put("mail.smtp.port", "25")
    props.put("mail.smtp.auth", "true")
    props.put("mail.smtp.user", "akreci")
    props.put("mail.smtp.password", "Password1$")
    props.put("from", "akreci@unagw.com")
    props.put("to", "testuser1@unagw.com")

    return props
  }
}