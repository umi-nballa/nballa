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

  function setSERPIndicator(initiateSERP:boolean)  {
    this.SERPEndorsed_Ext = initiateSERP
  }

  function getPhoneNumberValue(contact:Contact):String{
    var phoneNumberValue:String
    if(contact typeis Company){
      phoneNumberValue =  contact.WorkPhoneValue
    }else if(contact typeis Person){
      if(contact.PrimaryPhone == PrimaryPhoneType.TC_WORK && contact.WorkPhoneExtension!=null){
        phoneNumberValue = contact.WorkPhoneValue + contact.WorkPhoneExtension
      }else if(contact.PrimaryPhone == PrimaryPhoneType.TC_WORK && contact.WorkPhoneExtension==null){
        phoneNumberValue = contact.WorkPhoneValue
      }
      if(contact.PrimaryPhone == PrimaryPhoneType.TC_HOME)
        phoneNumberValue = contact.HomePhoneValue
      else if(contact.PrimaryPhone == PrimaryPhoneType.TC_MOBILE)
        phoneNumberValue = contact.CellPhone
    }
    return phoneNumberValue
  }

  function getLocationValue(policyPeriod : PolicyPeriod):String{
    var location:String
    if(policyPeriod.HomeownersLine_HOEExists) {
      location = (policyPeriod.HomeownersLine_HOE.HOLocation.PolicyLocation) as String
    }else if(policyPeriod.BP7LineExists){
      for (pLoc in policyPeriod.BP7Line.BP7Locations*.PolicyLocation){
          location = pLoc.DisplayName + " " + pLoc.PostalCode
        }
      } else if (policyPeriod.CPLineExists) {
         location = policyPeriod.PrimaryLocation.AddressLine1 + "," +
                    policyPeriod.PrimaryLocation.City + "," +
                    policyPeriod.PrimaryLocation.State + " " +
                    policyPeriod.PrimaryLocation.PostalCode
    }
    return location
  }
}