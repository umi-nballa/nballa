package una.integration.authentication

uses com.guidewire.pl.system.service.LoginServiceAuthenticationServicePluginCallbackHandler
uses gw.plugin.security.AuthenticationServicePlugin
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses una.integration.UnaIntTestBase
uses una.integration.plugins.authentication.AuthenticationServicePluginImpl
uses una.utils.PropertiesHolder

uses javax.security.auth.login.FailedLoginException
uses java.lang.Exception

/**
 * GUnit test class for Authentication Service Implementation.
 * CreatedBy: VTadi
 * Date: 5/31/2016
 */
class AuthenticationServiceTest extends UnaIntTestBase {
  static var authPlugin : AuthenticationServicePlugin

  /**
   * This method is used to initialize the test data common for all the tests in this class
   */
  override function beforeClass() {
    super.beforeClass()
    Logger.info("Initializing AuthenticationServicePluginImpl")
    authPlugin = new AuthenticationServicePluginImpl()
    authPlugin.setCallback(new LoginServiceAuthenticationServicePluginCallbackHandler())
  }

  /**
   * This method is used to free up of resources initialized in the beforeClass() method
   */
  override function afterClass() {
    Logger.info("Dereferencing the AuthenticationServicePluginImpl")
    authPlugin = null
    super.afterClass()
  }

  /**
   * Tests the authentication service with super user credentials (su/gw).
   */
  function testSuperUserAuthentication() {
    Logger.info("Entering the test method 'testSuperUserAuthentication'")

    var authSource = new UserNamePasswordAuthenticationSource()
    authSource.Username = "su"
    authSource.Password = "gw"

    var userPublicID = authPlugin.authenticate(authSource)
    Logger.info("The User Public ID: ${userPublicID}")
    assertNotNull("Login failed for super user 'su'", userPublicID)
    Logger.info("Exiting the test method 'testSuperUserAuthentication'")
  }

  /**
   * Tests the authentication service with ldap user credentials (FThompson/Uicna@2016).
   */
  function testValidLDAPUserAuthentication() {
    Logger.info("Entering the test method 'testValidLDAPUserAuthentication'")
    // Setup test data in GW database
    var user = createUser(PropertiesHolder.getProperty("LDAP_PC_TEST_USERNAME"))

    var authSource = new UserNamePasswordAuthenticationSource()
    authSource.Username = user.Credential.UserName
    authSource.Password = PropertiesHolder.getProperty("LDAP_PC_TEST_USER_PASSWORD")

    var userPublicID = authPlugin.authenticate(authSource)
    Logger.info("The User Public ID: ${userPublicID}")
    assertNotNull("Login failed for the LDAP user ${user.Credential.UserName}", userPublicID)
    Logger.info("Exiting the test method 'testValidLDAPUserAuthentication'")
  }

  /**
   * Tests the authentication service with invalid ldap user credentials (TestUser/gw).
   */
  function testInvalidLDAPUserAuthentication() {
    Logger.info("Entering the test method 'testInvalidLDAPUserAuthentication'")
    // Setup test data in GW database
    createUser("TestUser")

    var authSource = new UserNamePasswordAuthenticationSource()
    authSource.Username = "TestUser"
    authSource.Password = "gw"
    var exception: Exception = null
    try {
      authPlugin.authenticate(authSource)
    } catch (ex: Exception) {
      exception = ex
    } finally {
      assertNotNull("No exception thrown. Should throw FailedLoginException for invalid user credentials", exception)
      assertTrue("Incorrect exception thrown. Should throw FailedLoginException for invalid user credentials", exception typeis FailedLoginException)
    }
    Logger.info("Exiting the test method 'testInvalidLDAPUserAuthentication'")
  }
}