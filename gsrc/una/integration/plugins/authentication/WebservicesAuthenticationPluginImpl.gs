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
uses java.util.ArrayList
uses java.lang.Exception

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
    LOGGER.info("Entering into WebservicesAuthenticationPluginImpl.authenticate() method")
    var user: User = null
    try {
      var authMethods = new ArrayList<Pair<String,String>>()
      // Http authentication
      var authHeaders = context.getHttpHeaders().getHeader("Authorization")
      if (authHeaders != null) {
        var authentications = authHeaders.split(",")
        authentications.each( \ elt -> {
          var auth = elt.trim()
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
      // Soap authentication
      var headersFromEnvelope = context.getRequestSoapHeaders()
      if (headersFromEnvelope != null) {
        var auth = headersFromEnvelope.getChild(Authentication.$QNAME) as Authentication
        if ((auth != null) && (!auth.$Nil)) {
          authMethods.add(new Pair<String, String>(auth.Username, auth.Password))
        }
      }

      if (!authMethods.isEmpty()) {
        if (authMethods.size() > 1) {
          throw new WsiAuthenticationException("Multiple authentication methods provided: " + authMethods)
        }
        user = authenticate(authMethods.first().First, authMethods.first().Second)
      }
    } catch (ex: WsiAuthenticationException) {
      LOGGER.warn(ex.Message)
      throw ex
    } catch (ex: Exception) {
      LOGGER.error("Unexpected Error during Authentication", ex)
      throw new WsiAuthenticationException(ex.Message)
    }
    LOGGER.info("Exiting WebservicesAuthenticationPluginImpl.authenticate() method")
    return user
  }

  /**
   * Authenticating the username and password in the GW PC database. Returns the User object if authentication successful.
   */
  private function authenticate(username: String, password: String): User {
    if (InitTab.getInstance().getRunLevel().isEarlier(Runlevel.NODAEMONS)) {
      throw new WsiAuthenticationException("The server must be at NODAEMONS runlevel or greater in order to use webservice authentication")
    }
    try {
      var handler = new LoginServiceAuthenticationServicePluginCallbackHandler ()
      var uid = handler.findUser(username)
      if (uid == null) {
        throw new WsiAuthenticationException("Bad username or password")
      }
      var result = handler.verifyInternalCredential(uid, password)
      if (result.Message != CredentialVerificationResult.SUCCESS.Message) {
        throw new WsiAuthenticationException("Bad username or password")
      }
      return Query.make(User).compare("PublicID", Equals, uid).select().AtMostOneRow
    } catch (ex: LoginException) {
      throw new WsiAuthenticationException("Bad username or password")
    }
  }
}