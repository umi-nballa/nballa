package gw.acc.dba.enhancements

enhancement PolicyPeriod_ExtEnhancement : entity.PolicyPeriod {

  function addPrimaryNamedInsuredDBAs_Ext(primaryNamedInsured : PolicyPriNamedInsured) : PolicyPriNamedInsured {

     for(cc in primaryNamedInsured.AccountContactRole.AccountContact.Contact.AllContactContacts.where(\ c ->c.Relationship == typekey.ContactRel.TC_DBA )){
        var acr = cc.RelatedContact.AccountContacts.first().Roles.first()
        var pcrdba = this.addNewPolicyContactRoleForContact(acr.AccountContact.Contact, "PolicyDBARole_Ext") as PolicyDBARole_Ext
         /* Creating the join entity with the policyPeriod  because the effedated branch type on the 
            entity is policyPeriod*/      
        var pcrpcr = new PolicyContactRoleDBARole_Ext(this)
        pcrpcr.PolicyContactRole = primaryNamedInsured
        pcrpcr.PolicyDBARole = pcrdba
     }

    return primaryNamedInsured
  }

  function getPolicyTypeCodeString(policyPeriod : PolicyPeriod) : String{
    if(policyPeriod.HomeownersLine_HOEExists) {
      return policyPeriod.HomeownersLine_HOE.HOPolicyType.Code
    }
    return null
  }
}
