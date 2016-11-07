package edge.samlV2.authplugins

uses gw.plugin.security.AuthenticationSource
uses com.guidewire.pl.system.dependency.PLDependencies
uses edge.samlV2.util.SAMLProcessor
uses org.opensaml.saml2.core.StatusCode

class SAMLAuthenticationSource implements AuthenticationSource {
  private var processor = new SAMLProcessor()
  private var user:String as Username = null
  private var pid:String as PublicID = null
  private var assertionId:String = null
  private var assertionVerified:Boolean as Authenticated = Boolean.FALSE


  public construct(inbound:String) {
    var resp = processor.readResponse(inbound)
    processor.validateSignature(resp)
    print(resp.Status.StatusCode.Value)
    if(resp.Status.StatusCode.Value == StatusCode.SUCCESS_URI) {
      var assertion = resp.Assertions.first()
      user = assertion.Subject.NameID.Value
      print(user)

      var t = PLDependencies.getUserFinder().findByCredentialName(user)
      pid = t.PublicID
      print(pid)
      assertionVerified = Boolean.TRUE
    }
  }

  override property get Hash(): char[] {
    return assertionId
  }

  override function determineSourceComplete(): boolean {
    return true
  }
}
