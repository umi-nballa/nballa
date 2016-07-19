package gw.acc.dba.enhancements
uses gw.plugin.Plugins
uses gw.plugin.contact.IContactConfigPlugin


enhancement PolicyLineDBA_ExtEnhancement : entity.PolicyLine {
  
   /**
   * sourceContact is the Contact that we are adding a DBA to.
   * targetContact is the new empty contact.  
   */
  function addNewPolicyDBARole(sourceContact : Contact, sourcePolicyRole : PolicyContactRole, targetContact : Contact) : PolicyContactRoleDBARole_Ext {
    
     var policyDBARole = this.Branch.addNewPolicyContactRoleForContact(targetContact, "PolicyDBARole_Ext") as PolicyDBARole_Ext
 
 
     var a  = sourceContact.AllContactContacts
                   .where(\ c -> c.SourceContact == sourceContact and 
                                 c.RelatedContact == targetContact and 
                                 c.Relationship == typekey.ContactRel.TC_DBA)
     
     if(a.IsEmpty){
      // Add the ContactContact
       var cc = new ContactContact()

       cc.SourceContact = sourceContact  // Named Insured Etc..
       cc.RelatedContact = targetContact       // New Account DBA 
       cc.Relationship = typekey.ContactRel.TC_DBA 
     }
     
     
     var pdba = new PolicyContactRoleDBARole_Ext(this.Branch)
     pdba.PolicyDBARole= policyDBARole
     pdba.PolicyContactRole = sourcePolicyRole
     sourcePolicyRole.addToDBAs(pdba)
     
     
    
    return pdba
   }
   
  property get AdditionalInsuredOtherCandidatesExclueDBA() : AccountContact[] {
    var plugin = Plugins.get(IContactConfigPlugin)
    var accountContactRoleType = plugin.getAccountContactRoleTypeFor("PolicyAddlInsured")
    return this.Branch.Policy.Account.ActiveAccountContacts
      .where(\ acr -> plugin.canBeRole(acr.ContactType, accountContactRoleType) and not acr.hasRole(accountContactRoleType)
         and not acr.hasRole(typekey.AccountContactRole.TC_DBAROLE_EXT))
  }
  
  
}
