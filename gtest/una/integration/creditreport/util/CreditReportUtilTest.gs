package una.integration.creditreport.util

uses entity.PolicyLine
uses typekey.UWCompanyCode
uses typekey.State
uses entity.PolicyContactRole
uses entity.CreditReportParametersExt
uses entity.PolicyPeriod
uses typekey.Jurisdiction
uses entity.Address

uses gw.api.builder.PersonBuilder
uses java.util.Random
uses java.lang.System
uses una.integration.creditreport.testutil.AccountFactory
uses una.integration.creditreport.testutil.PolicyPeriodFactory
uses una.integration.framework.util.CreditReportUtil

@gw.testharness.ServerTest
class CreditReportUtilTest extends gw.testharness.TestBase {

  static var rand : int = 0
  static var address : Address

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
  
  override function beforeMethod() {
    
    rand = new Random(System.currentTimeMillis()).nextInt(10)
  }
  
  function testGetCreditReportParameters() {    
    
    assertNotNull(CreditReportUtil.getCreditReportParameters(PolicyPeriodFactory.createPolicyPeriod(\ -> {return new PersonBuilder()
                 .withFirstName(AccountFactory.FirstNameArray[rand])
                 .withLastName(AccountFactory.LastNameArray[rand])
                 .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
               })))
  }
  
  function testGetCreditReportParametersNull() {
        
    assertNull(CreditReportUtil.getCreditReportParameters((null)))
  }
  
  function testGetCreditReportParametersV2() {
        
    var pp = PolicyPeriodFactory.createPolicyPeriod(\ -> {return new PersonBuilder()
                 .withFirstName(AccountFactory.FirstNameArray[rand])
                 .withLastName(AccountFactory.LastNameArray[rand])
                 .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
             })
               
    assertNotNull(CreditReportUtil.getCreditReportParameters(pp.Lines.first().PatternCode, pp.UWCompanyCode, pp.BaseState))
  }
  
  function testGetCreditReportParametersV2Null() {
        
    assertNull(CreditReportUtil.getCreditReportParameters((null), null, null))
  }
  
  function testCreateCreditReportRequest() {
    
    var pp = PolicyPeriodFactory.createPolicyPeriod(\ -> {return new PersonBuilder()
               .withFirstName(AccountFactory.FirstNameArray[rand])
               .withLastName(AccountFactory.LastNameArray[rand])
               .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
             })    
    assertNotNull(CreditReportUtil.createCreditReportRequest(address, AccountFactory.FirstNameArray[rand], null, AccountFactory.LastNameArray[rand], pp, pp.PolicyContactRoles.first()))
  }
  
  function testCreateCreditReportRequestNull() {
    
    assertNull(CreditReportUtil.createCreditReportRequest(null, null, null, null, null, null))
  }
    
  function testIsCreditReportRequiredPositive() {
    
    var pp = PolicyPeriodFactory.createPolicyPeriod(\ -> {return new PersonBuilder()
               .withFirstName(AccountFactory.FirstNameArray[rand])
               .withLastName(AccountFactory.LastNameArray[rand])
               .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, -30))
             })
    assertTrue(CreditReportUtil.isCreditReportRequired(pp))
  }
  
  function testIsCreditReportRequiredNegative() {
    
    var pp = PolicyPeriodFactory.createPolicyPeriod(\ -> {return new PersonBuilder()
               .withFirstName(AccountFactory.FirstNameArray[rand])
               .withLastName(AccountFactory.LastNameArray[rand])
               .withDateOfBirth(gw.api.util.DateUtil.addYears(AccountFactory.date, -15))
             })
    assertFalse(CreditReportUtil.isCreditReportRequired(pp))
  }
  
  function testIsCreditReportRequiredNull() {
    
    assertTrue(CreditReportUtil.isCreditReportRequired(null))
  }
}
