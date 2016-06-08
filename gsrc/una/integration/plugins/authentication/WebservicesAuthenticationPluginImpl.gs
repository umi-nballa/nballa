package una.integration.plugins.authentication

uses com.guidewire.pl.system.server.InitTab
uses com.guidewire.pl.system.service.LoginServiceAuthenticationServicePluginCallbackHandler
uses gw.api.database.Query
uses gw.api.system.server.Runlevel
uses gw.plugin.security.CredentialVerificationResult
uses gw.plugin.security.WebservicesAuthenticationContext
uses gw.plugin.security.WebservicesAuthenticationPlugin
uses gw.util.Base64Util
uses gw.util.Pair
uses gw.util.StreamUtil
uses gw.xml.ws.WsiAuthenticationException
uses gw.xsd.guidewire.soapheaders.Authentication
uses una.logging.UnaLoggerCategory

uses javax.security.auth.login.LoginException
uses java.lang.Exception
uses java.util.ArrayList

/**
 * Webservice Authentication Plugin Implementation class for authentication of users via webservice calls.
 * Created By: vtadi on 5/16/2016
 */
class WebservicesAuthenticationPluginImpl implements WebservicesAuthenticationPlugin {
  final static var LOGGER = UnaLoggerCategory.UNA_SECURITY

  /**
   * Authenticates a webservice call source against GW PC database and returns the User object.
   * If authentication fails, it throws an exception of type WsiAuthenticationException.
   * @param context the webservice authentication context.
   * @returns User the authenticated user object.
   */
  override function authenticate(context: WebservicesAuthenticationContext): User {
    LOGGER.debug("Entering WebservicesAuthenticationPluginImpl.authenticate() method")
    var user: User = null
    try {
      if (InitTab.getInstance().getRunLevel().isEarlier(Runlevel.NODAEMONS)) {
        throw new WsiAuthenticationException("The server must be at NODAEMONS runlevel or greater in order to use webservice authentication")
      }

      // Retrieving the user credentials from the context
      var userCredentials = retrieveUserCredentials(context)
      var userName = userCredentials.First
      var password = userCredentials.Second

      // Authenticating the username and password in PolicyCenter database.
      try {
        var handler = new LoginServiceAuthenticationServicePluginCallbackHandler ()
        var uid = handler.findUser(userName)
        if (uid == null) {
          throw new WsiAuthenticationException("Bad username or password")
        }
        var result = handler.verifyInternalCredential(uid, password)
        if (result.Message != CredentialVerificationResult.SUCCESS.Message) {
          throw new WsiAuthenticationException("Bad username or password")
        }
        user = Query.make(User).compare("PublicID", Equals, uid).select().AtMostOneRow
      } catch (ex: LoginException) {
        throw new WsiAuthenticationException("Bad username or password")
      }
    } catch (ex: WsiAuthenticationException) {
      LOGGER.warn(ex.Message)
      throw ex
    } catch (ex: Exception) {
      LOGGER.error("Unexpected Error during Authentication", ex)
      throw new WsiAuthenticationException(ex.Message)
    }
    LOGGER.debug("Exiting WebservicesAuthenticationPluginImpl.authenticate() method")
    return user
  }

  /**
   * Retrieves the webservice client user credentials from the given context.
   */
  private function retrieveUserCredentials(context: WebservicesAuthenticationContext): Pair<String, String> {
    var authMethods = new ArrayList<Pair<String,String>>()
    // Using Authorization Http Header to retrieve Http Basic Authentication credentials, if any
    var authHeaders = context.getHttpHeaders().getHeader("Authorization")
    if (authHeaders != null) {
      var authentications = authHeaders.split(",")
      authentications.each( \ elt -> {
        var auth = elt.trim()
        // Http Basic Authentication credentials starts with 'Basic '.
        if (auth.startsWith("Basic ")) {
          var authString = auth.substring(6)
          var usernamePassword = StreamUtil.toString(Base64Util.decode(authString))
          var idx = usernamePassword.indexOf(':')
          if (idx < 0) {
            throw new WsiAuthenticationException("Expected colon-delimited username/password in basic authentication base64-encoded string")
          }
          authMethods.add(new Pair<String, String>( usernamePassword.substring(0, idx), usernamePassword.substring(idx + 1) ) )
        } else {
          throw new WsiAuthenticationException("Unrecognized HTTP authentication method: " + auth)
        }
      })
    }
    // Using the request SOAP headers to retrieve authentication credentials, if any
    var headersFromEnvelope = context.getRequestSoapHeaders()
    if (headersFromEnvelope != null) {
      var auth = headersFromEnvelope.getChild(Authentication.$QNAME) as Authentication
      if ((auth != null) && (!auth.$Nil)) {
        authMethods.add(new Pair<String, String>(auth.Username, auth.Password))
      }
    }
    // Validating the number of authentication methods provided.
    if (authMethods.Empty) {
      throw new WsiAuthenticationException("No authentication details provided.")
    }
    if (authMethods.size() > 1) {
      throw new WsiAuthenticationException("Multiple authentication methods provided: " + authMethods)
    }

    return authMethods.first()
  }
}