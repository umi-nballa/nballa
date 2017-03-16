package gw.plugin.billing.bc800

uses java.util.ArrayList
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCAccountInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.types.complex.PCContactInfo
uses wsi.remote.gw.webservice.bc.bc800.entity.anonymous.elements.PCAccountInfo_OtherBillingContacts

@Export
enhancement PCAccountInfoEnhancement : PCAccountInfo
{
  function sync(account : Account){
    this.AccountNumber = account.AccountNumber
    this.AccountName = account.AccountHolderContact.AccountName
    this.AccountNameKanji = account.AccountHolderContact.AccountNameKanji

    this.CustomerServiceTier = account.ServiceTier as String

    var insuredContact = new PCContactInfo()
    insuredContact.sync( account.AccountHolderContact )
    this.InsuredContact.$TypeInstance = insuredContact

    var insuredContactID = account.AccountHolderContact.ID
    var policyPeriod = account.Policies.last().LatestPeriod
    var policyAdditionalInterests = PolicyInfoUtil.retrieveAdditionalInterests(policyPeriod)
    var primaryPayer = policyPeriod.BillingContact
    if (primaryPayer.ContactDenorm.ID == insuredContactID) {
      this.InsuredIsBilling = true
    } else if (primaryPayer != null) {
      // Mapping Primary Billing Contact (if insured is not primary payer)
      var primaryBillingContact = new PCContactInfo()
      primaryBillingContact.sync(primaryPayer.ContactDenorm)
      primaryBillingContact.LoanNumber =
          policyAdditionalInterests?.firstWhere( \ addlInt -> {
            return addlInt.PolicyAddlInterest.ContactDenorm == primaryPayer.ContactDenorm
          })?.ContractNumber
      this.PrimaryBillingContact.$TypeInstance = primaryBillingContact
    }
    // Mapping Other Billing Contacts
    var accountBillingContacts = account.getAccountContactsWithRole( typekey.AccountContactRole.TC_BILLINGCONTACT)
    accountBillingContacts.where( \ b -> b.Contact.ID != insuredContactID && b.Contact.ID != primaryPayer.ContactDenorm.ID).each( \ b -> {
      var contInfo = new PCContactInfo()
      contInfo.sync( b.Contact )
      contInfo.LoanNumber =
          policyAdditionalInterests?.firstWhere( \ addlInt -> {
            return addlInt.PolicyAddlInterest.ContactDenorm == b.Contact
          })?.ContractNumber

      var element = new PCAccountInfo_OtherBillingContacts()
      element.$TypeInstance = contInfo
      this.OtherBillingContacts.add(element)
    })
  }
}
