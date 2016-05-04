package una.utils
uses java.lang.*
uses java.util.Hashtable
uses javax.naming.Context
uses javax.naming.NamingEnumeration
uses javax.naming.NamingException
uses javax.naming.directory.DirContext
uses javax.naming.directory.SearchControls
uses javax.naming.directory.SearchResult
uses javax.naming.ldap.InitialLdapContext
uses javax.naming.ldap.LdapContext

public class CpLDAPAuthenticationServicePlugin  {

  public static function main(args : String[]) : void {
    final var ldapAdServer = "ldap://ad.your-server.com:389"
    final var ldapSearchBase = "dc=ad,dc=my-domain,dc=com"
    final var ldapUsername = "myLdapUsername"
    final var ldapPassword = "myLdapPassword"
    final var ldapAccountToLookup = "myOtherLdapUsername"
    var env = new Hashtable<String, Object>()
    env.put(Context.SECURITY_AUTHENTICATION, "simple")
    if (ldapUsername != null) {
      env.put(Context.SECURITY_PRINCIPAL, ldapUsername)
    }
    if (ldapPassword != null) {
      env.put(Context.SECURITY_CREDENTIALS, ldapPassword)
    }
    env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory")
    env.put(Context.PROVIDER_URL, ldapAdServer)
    env.put("java.naming.ldap.attributes.binary", "objectSID")
    var ctx  = new InitialLdapContext()
    var ldap = new CpLDAPAuthenticationServicePlugin()
    var srLdapUser  = ldap.findAccountByAccountName(ctx, ldapSearchBase, ldapAccountToLookup)
    var primaryGroupSID  = ldap.getPrimaryGroupSID(srLdapUser)
    var primaryGroupName = ldap.findGroupBySID(ctx, ldapSearchBase, primaryGroupSID)
  }

  public function findAccountByAccountName(ctx : DirContext, ldapSearchBase : String, accountName : String) : SearchResult {
    var searchFilter = "(&(objectClass=user)(sAMAccountName=" + accountName + "))"
    var searchControls = new SearchControls()
    searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE)
    var results  = ctx.search(ldapSearchBase, searchFilter, searchControls)
    var searchResult : SearchResult = null
    if (results.hasMoreElements()) {
      searchResult = results.nextElement()
      if (results.hasMoreElements()) {
        print("Matched multiple users for the accountName: " + accountName)
        return null
      }
    }
    return searchResult
  }

  public function findGroupBySID(ctx : DirContext, ldapSearchBase : String, sid : String) : String {
    var searchFilter  = "(&(objectClass=group)(objectSid=" + sid + "))"
    var searchControls = new SearchControls()
    searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE)
    var results = ctx.search(ldapSearchBase, searchFilter, searchControls)
    if (results.hasMoreElements()) {
      var searchResult = results.nextElement()
      if (results.hasMoreElements()) {
        print("Matched multiple groups for the group with SID: " + sid)
        return null
      } else {
        return searchResult.getAttributes().get("sAMAccountName").get() as String
      }
    }
    return null
  }

  public function getPrimaryGroupSID(srLdapUser : SearchResult) : String {
    var objectSID  = srLdapUser.getAttributes().get("objectSid").get() as byte[]
    var strPrimaryGroupID = srLdapUser.getAttributes().get("primaryGroupID").get() as String
    var strObjectSid  = decodeSID(objectSID)
    return strObjectSid.substring(0, strObjectSid.lastIndexOf('-') + 1) + strPrimaryGroupID
  }

  public static function decodeSID(sid : byte[]) : String {
    final var strSid = new StringBuilder("S-")
    final var revision : int = sid[0]
    strSid.append(Integer.toString(revision))
    final var countSubAuths  = sid[1] & 255
    var authority = 0L
    var i = 2
    while (i <= 7) {
      authority |= (sid[i] as long) << (8 * (5 - (i - 2)))
      i++
    }

    strSid.append("-")
    strSid.append(Long.toHexString(authority))
    var offset = 8
    var size = 4
    var j = 0
    while (j < countSubAuths) {
      var subAuthority = 0L
      var k = 0
      while (k < size) {
        subAuthority |= (sid[offset + k] & 255) as long << (8 * k)
        k++
      }

      strSid.append("-")
      strSid.append(subAuthority)
      offset += size
      j++
    }

    return strSid.toString()
  }

}
