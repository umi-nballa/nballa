package una.integration.creditreport

uses entity.PolicyContactRole
uses typekey.State
uses entity.Address
uses entity.PolicyPeriod

uses java.util.Random
uses java.lang.System
uses gw.api.builder.PersonBuilder
uses gw.api.builder.CompanyBuilder
uses una.integration.mapping.creditreport.CreditReportRequestDispatcher
uses una.integration.creditreport.testutil.AccountFactory
uses una.integration.creditreport.testutil.PolicyPeriodFactory

@gw.testharness.ServerTest
class CreditReportRequestDispatcherTest extends gw.testharness.TestBase {

  static var rand : int
  static var address : Address
  static var dispatcher : CreditReportRequestDispatcher
  
  override function beforeClass() {
    
    rand = new Random(System.currentTimeMillis()).nextInt(10)
    
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      
      address = new Address()
      address.AddressLine1 = AccountFactory.AddressLine1Array[rand]
      address.City = AccountFactory.AddressCityArray[rand]
      address.State = typekey.State.TC_CA
      address.PostalCode = AccountFactory.AddressZipArray[rand]
    })
  }
  
  function testOrderNewCreditReportPerson() {

    var pp = PolicyPeriodFactory.createPolicyPeriod(\ -> {return new PersonBuilder()
               .withFirstName(AccountFactory.FirstNameArray[rand])
               .withLastName(AccountFactory.LastNameArray[rand])
               .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
             })
    dispatcher = new CreditReportRequestDispatcher(pp.PolicyContactRoles.first(), pp)
    var resp = dispatcher.orderNewCreditReport(address, AccountFactory.FirstNameArray[rand], null, AccountFactory.LastNameArray[rand],
        gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
    assertNotNull(resp)
  }
  
  function testOrderNewCreditReportCompany() {

    var pp = PolicyPeriodFactory.createPolicyPeriod(\ -> {return new CompanyBuilder()
               .withCompanyName((AccountFactory.FirstNameArray[rand]))
             })
    dispatcher = new CreditReportRequestDispatcher(pp.PolicyContactRoles.first(), pp)
    var resp = dispatcher.orderNewCreditReport(address, AccountFactory.FirstNameArray[rand], null, AccountFactory.LastNameArray[rand],
        gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
    assertNotNull(resp)
  }
}