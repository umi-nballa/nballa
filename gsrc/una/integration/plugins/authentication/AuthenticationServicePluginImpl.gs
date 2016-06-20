package una.integration.plugins.authentication

uses gw.api.database.Query
uses gw.api.system.server.ServerUtil
uses gw.plugin.security.AuthenticationServicePlugin
uses gw.plugin.security.AuthenticationServicePluginCallbackHandler
uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.CredentialVerificationResult
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses org.apache.commons.lang.StringUtils
uses una.logging.UnaLoggerCategory
uses una.utils.PropertiesHolder

uses javax.naming.Context
uses javax.naming.NamingException
uses javax.naming.directory.InitialDirContext
uses javax.naming.directory.SearchControls
uses javax.security.auth.login.FailedLoginException
uses java.lang.Exception
uses java.lang.IllegalArgumentException
uses java.util.Enumeration
uses java.util.Hashtable

/**
 * Authentication Service Plugin Implementation class for authentication of users logging in from UI.
 * Created By: vtadi on 5/16/2016
 */
public class AuthenticationServicePluginImpl implements AuthenticationServicePlugin {
  final static var LOGGER = UnaLoggerCategory.UNA_SECURITY
  final static var CONTEXT_FACTORY_CLASS = "com.sun.jndi.ldap.LdapCtxFactory"
  final static var LDAP_PROVIDER_URL = PropertiesHolder.getProperty("LDAP_PROVIDER_URL")
  final static var LDAP_ADMIN_USER = PropertiesHolder.getProperty("LDAP_ADMIN_USER")
  final static var LDAP_ADMIN_PASSWORD = PropertiesHolder.getProperty("LDAP_ADMIN_PASSWORD")
  final static var LDAP_SECURITY_LEVEL = PropertiesHolder.getProperty("LDAP_SECURITY_LEVEL")
  final static var LDAP_CONTEXT_NAME = PropertiesHolder.getProperty("LDAP_CONTEXT_NAME")
  final static var LDAP_SERVER_BYPASS_ENV = PropertiesHolder.getProperty("LDAP_SERVER_BYPASS_ENV")
  final static var LDAP_SERVER_BYPASS_USERNAME = PropertiesHolder.getProperty("LDAP_SERVER_BYPASS_USERNAME")
  final static var LDAP_PC_USER_GROUP = "PolicyCenter"
  var _callbackHandler: AuthenticationServicePluginCallbackHandler

  /**
   * Initializes the plugin callback handler object
   * @param handler the callback handler object
   */
  override function setCallback(handler: AuthenticationServicePluginCallbackHandler) {
    _callbackHandler = handler
  }

  /**
   * Authenticate user information against LDAP server, fetch user from GW DB, and verify account status
   * @param authSource    source which contains Username and password
   * @return String the user's publicID
   */
  override function authenticate(authSource: AuthenticationSource): String {
    // Basic validation of AuthenticationSource data
    if (!(authSource typeis UserNamePasswordAuthenticationSource)) {
      LOGGER.error("Authentication source type [${typeof authSource}] is not known to this plugin")
      throw new IllegalArgumentException("Authentication source type [${typeof authSource}] is not known to this plugin")
    }
    var source = authSource as UserNamePasswordAuthenticationSource
    LOGGER.info("Authenticating login user: ${source.Username}")
    if (StringUtils.isEmpty(source.Username)) {
      LOGGER.warn("Null username")
      throw new FailedLoginException()
    }
    if (StringUtils.isEmpty(source.Password)) {
      LOGGER.warn("Null password")
      throw new FailedLoginException()
    }

    // Validate User status in GW application database
    var publicID = _callbackHandler.findUser(source.Username)
    if (publicID == null) {
      LOGGER.warn("User not found for the username: ${source.Username}")
      throw new gw.api.util.DisplayableLoginException("User not found")
    }
    var user = Query.make(User).compare(User#PublicID, Equals, publicID).select().AtMostOneRow
    if (user.Credential.Locked) {
      LOGGER.warn("User account is locked for the username: ${source.Username}")
      throw new gw.plugin.security.LockedCredentialException("User account is locked")
    }
    if (!user.Credential.Active) {
      LOGGER.warn("User account is inactive for the username: ${source.Username}")
      throw new gw.plugin.security.InactiveUserException("User account is inactive")
    }

    /* Bypass LDAP Authentication based on Script Parameter value, Environment, and Username    */
   /* if (!ScriptParameters.LDAP_Authentication
        || (LDAP_SERVER_BYPASS_USERNAME != null && LDAP_SERVER_BYPASS_USERNAME.equalsIgnoreCase(source.Username))
        || (LDAP_SERVER_BYPASS_ENV != null and LDAP_SERVER_BYPASS_ENV.containsIgnoreCase(ServerUtil.Env))) {
      LOGGER.info("Bypassing LDAP authentication for the user: " + source.Username)
      authenticateUserInternal(source, publicID)
    } else {
      // Validate User through LDAP Server.
      authenticateUserAtLDAPServer(source)
    }*/

    LOGGER.info("Authentication complete with userID ${user.PublicID}")
    return user.PublicID
  }

  /**
   * Authenticating user credentials against the GW database
   * @param source the username and password information
   * @param publicID the public id of the user in GW database.
   */
  private function authenticateUserInternal(source: UserNamePasswordAuthenticationSource, publicID: String) {
    var returnCode = _callbackHandler.verifyInternalCredential(publicID, source.Password)
    if (returnCode.Message != CredentialVerificationResult.SUCCESS.Message) {
      LOGGER.warn("Invalid username/password provided for: ${source.Username}")
      throw new FailedLoginException("Invalid username/password provided for: ${source.Username}")
    }
  }

  /**
   * Authenticate user against LDAP server
   * @param source Username password information
   */
  private function authenticateUserAtLDAPServer(source: UserNamePasswordAuthenticationSource) {
    try {
      // Create a context with admin user credentials
      var env = new Hashtable<String, String>()
      env.put(Context.INITIAL_CONTEXT_FACTORY, CONTEXT_FACTORY_CLASS)
      env.put(Context.PROVIDER_URL, LDAP_PROVIDER_URL)
      env.put(Context.SECURITY_AUTHENTICATION, LDAP_SECURITY_LEVEL)
      env.put(Context.SECURITY_PRINCIPAL, LDAP_ADMIN_USER)
      env.put(Context.SECURITY_CREDENTIALS, LDAP_ADMIN_PASSWORD)
      // Create context with admin credentials
      var ctx = new InitialDirContext(env)

      // Search for the user that is trying to login
      var searchFilter = "(&(objectClass=user)(sAMAccountName=" + source.Username + "))"


      var searchControls = new SearchControls()
      searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE)
      searchControls.setReturningAttributes({"memberOf"})
      var results = ctx.search(LDAP_CONTEXT_NAME, searchFilter, searchControls)
      var dn: String = null
      if (results != null && results.hasMoreElements()) {
        var result = results.next()
        // Checks if the login user belongs to the PolicyCenter Group
        if(isUserMemberOfPCGroup(result)) {
          dn = result.getNameInNamespace()
        }
      }
      if (dn == null || dn.length() == 0) {
        throw new FailedLoginException("Invalid username/password provided for: ${source.Username}" )
      }

      // Authenticate the user against AD using full DN
      ctx.addToEnvironment(Context.SECURITY_AUTHENTICATION, LDAP_SECURITY_LEVEL)
      ctx.addToEnvironment(Context.SECURITY_PRINCIPAL, dn)
      ctx.addToEnvironment(Context.SECURITY_CREDENTIALS, source.Password)
      try {
        var obj = ctx.lookup(dn)
       } catch (e: NamingException) {
        throw new FailedLoginException("Invalid username/password provided for: ${source.Username}")
      }
    } catch (ex: FailedLoginException) {
      LOGGER.warn(ex.Message)
      throw ex
    } catch (e:Exception) {
      LOGGER.error("Unexpected Error during Authentication", e)
      throw new FailedLoginException("Unexpected Error during Authentication")
    }
  }

  /**
   * Checks if the given user is member of PolicyCenter group.
   */
  private function isUserMemberOfPCGroup(result: javax.naming.directory.SearchResult): boolean {
    var ret = false
    var memberOf: javax.naming.directory.Attribute = null
    memberOf = result.getAttributes().get("memberOf");
    if (memberOf != null){
      var e1: Enumeration = memberOf.getAll()
      if (e1.hasMoreElements()){
        while (e1.hasMoreElements()) {
          var memberOfGroup = getGroupsName(e1.nextElement().toString())
          if (memberOfGroup.equalsIgnoreCase(LDAP_PC_USER_GROUP)) {
            ret = true
          }
        }
      }
    }
    return ret
  }

  /**
   * Retrieves the group name for the given input.
   */
  private function getGroupsName(cnName: String): String {
    if (cnName != null && cnName.toUpperCase().startsWith("CN=")) {
      cnName = cnName.substring(3);
    }
    var position = cnName.indexOf(',');
    if (position == - 1) {
      return cnName;
    } else {
      return cnName.substring(0, position);
    }
  }


}