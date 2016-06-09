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
  final static var LDAP_PC_USER_GROUP = PropertiesHolder.getProperty("LDAP_PC_USER_GROUP")
  final static var LDAP_ATTR_MEMBER_OF = "memberOf"
  final static var LDAP_ATTR_COMMON_NAME = "CN="

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
   * @param authSource source which contains Username and password
   * @return String the user's publicID
   */
  override function authenticate(authSource: AuthenticationSource): String {
    LOGGER.debug("Entering AuthenticationServicePluginImpl.authenticate() method.")
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
    if (!ScriptParameters.LDAP_Authentication
        || (LDAP_SERVER_BYPASS_USERNAME != null && LDAP_SERVER_BYPASS_USERNAME.equalsIgnoreCase(source.Username))
        || (LDAP_SERVER_BYPASS_ENV != null and LDAP_SERVER_BYPASS_ENV.containsIgnoreCase(ServerUtil.Env))) {
      LOGGER.info("Bypassing LDAP authentication for the user: " + source.Username)
      authenticateUserInternal(source, publicID)
    } else {
      // Validate User through LDAP Server.
      authenticateUserAtLDAPServer(source)
    }
    LOGGER.info("Authentication successful for the userID ${user.PublicID}")
    LOGGER.debug("Exiting AuthenticationServicePluginImpl.authenticate() method.")
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
      // 1. Create a context with admin user credentials
      var env = new Hashtable<String, String>()
      env.put(Context.INITIAL_CONTEXT_FACTORY, CONTEXT_FACTORY_CLASS)
      env.put(Context.PROVIDER_URL, LDAP_PROVIDER_URL)
      env.put(Context.SECURITY_AUTHENTICATION, LDAP_SECURITY_LEVEL)
      env.put(Context.SECURITY_PRINCIPAL, LDAP_ADMIN_USER)
      env.put(Context.SECURITY_CREDENTIALS, LDAP_ADMIN_PASSWORD)
      var context = new InitialDirContext(env)
      // 2. Search for the LDAP User in the PolicyCenter Group for the given login username
      var searchFilter = "(&(objectClass=user)(sAMAccountName=" + source.Username + "))"
      var searchControls = new SearchControls()
      searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE)
      searchControls.setReturningAttributes({ LDAP_ATTR_MEMBER_OF })
      var results = context.search(LDAP_CONTEXT_NAME, searchFilter, searchControls)
      var userNameWithDomain: String = null
      if (results != null && results.hasMoreElements()) {
        var result = results.next()
        // Checks if the login user belongs to the PolicyCenter Group
        if(isUserMemberOfGroup(result, LDAP_PC_USER_GROUP)) {
          userNameWithDomain = result.getNameInNamespace()
        }
      }
      if (userNameWithDomain == null || userNameWithDomain.length() == 0) {
        throw new FailedLoginException("Invalid username/password provided for: ${source.Username}" )
      }
      // 3. Verify the user credentials
      context.addToEnvironment(Context.SECURITY_AUTHENTICATION, LDAP_SECURITY_LEVEL)
      context.addToEnvironment(Context.SECURITY_PRINCIPAL, userNameWithDomain)
      context.addToEnvironment(Context.SECURITY_CREDENTIALS, source.Password)
      try {
        context.lookup(userNameWithDomain)
      } catch (ex: NamingException) {
        throw new FailedLoginException("Invalid username/password provided for: ${source.Username}")
      }
    } catch (ex: FailedLoginException) {
      LOGGER.warn(ex.Message)
      throw ex
    } catch (ex: Exception) {
      LOGGER.error("Unexpected Error during Authentication", ex)
      throw new FailedLoginException("Unexpected Error during Authentication")
    }
  }

  /**
   * Checks if the given user is member of the given group.
   */
  private function isUserMemberOfGroup(result: javax.naming.directory.SearchResult, group: String): boolean {
    var isMemberOfGroup = false
    var memberOf = result.getAttributes().get(LDAP_ATTR_MEMBER_OF);
    if (memberOf != null){
      var memberGroups = memberOf.getAll()
      if (memberGroups.hasMoreElements()){
        while (memberGroups.hasMoreElements()) {
          var groupName = getGroupName(memberGroups.nextElement() as String)
          if (groupName.equalsIgnoreCase(group)) {
            isMemberOfGroup = true
            break
          }
        }
      }
    }
    return isMemberOfGroup
  }

  /**
   * Retrieves the group name from the given LDAP Common Name string.
   */
  private function getGroupName(commonName: String): String {
    // LDAP Group Common Name starts with "CN="
    if (commonName != null && commonName.toUpperCase().startsWith(LDAP_ATTR_COMMON_NAME)) {
      commonName = commonName.substring(3);
    }
    var position = commonName.indexOf(',');
    if (position == - 1) {
      return commonName;
    } else {
      return commonName.substring(0, position);
    }
  }
}