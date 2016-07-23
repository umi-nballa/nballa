package una.integration.creditreport.testutil

uses entity.AccountContact
uses entity.NamedInsured
uses entity.Account
uses typekey.BillingMethod
uses entity.Contact
uses entity.PolicyPeriod

uses gw.api.databuilder.ContactBuilder
uses gw.api.builder.AccountLocationBuilder
uses gw.api.builder.AccountContactBuilder
uses gw.api.builder.DriverBuilder
uses gw.api.builder.AccountBuilder
uses gw.api.builder.SubmissionBuilder
uses gw.api.builder.PolicyPriNamedInsuredBuilder
uses gw.api.builder.NamedInsuredBuilder
uses gw.api.builder.PolicyAddlNamedInsuredBuilder


class PolicyPeriodFactory {

  private static function createNamedInsured(account: Account, contact: Contact): NamedInsured {
    
      var namedInsuredBuilder = new NamedInsuredBuilder()
      new AccountContactBuilder()
          .withRole(namedInsuredBuilder)
          .onAccount(account)
          .withContact(contact)
          .createAndCommit()

      return namedInsuredBuilder.LastCreatedBean
  }

  static function createPolicyPeriod(contactBuilder() : ContactBuilder) : PolicyPeriod {
        
    var pp : PolicyPeriod
    
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {        
      
      var accountLocationBuilder = new AccountLocationBuilder()
      var driverBuilder = new DriverBuilder()
      var driverAccountContact = new AccountContactBuilder()
        .withContact(contactBuilder())
        .withRole(driverBuilder)
      var account = new AccountBuilder()
        .withAccountLocation(accountLocationBuilder)
        .withAccountContact(driverAccountContact)
      var namedInsured = createNamedInsured(account.create(), contactBuilder().create())
      var smBuilder = new SubmissionBuilder()
        .withAccount(account)
        .withProduct(AccountFactory.product)
        .withBillingMethod(BillingMethod.TC_DIRECTBILL)
        .withPolicyContactRole(new PolicyAddlNamedInsuredBuilder()
        .withAccountContactRole(namedInsured))
        .withPrimaryNamedInsured(new PolicyPriNamedInsuredBuilder()
        .withAccountContactRole(namedInsured))                
      pp = smBuilder.create(bundle)
    })

    return pp
  }
}
