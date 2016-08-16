package una.integration.creditreport

uses typekey.State
uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.creditreport.testutil.AccountFactory

@gw.testharness.ServerTest
class CreditReportRequestTest extends gw.testharness.TestBase {
 
  function testBuilder() {
    
    var req = new CreditReportRequest
          .Builder()
          .withFirstName(AccountFactory.FirstNameArray[0])
          .withMiddleName(null)
          .withLastName(AccountFactory.LastNameArray[0])
          .withSocialSecurityNumber(AccountFactory.IsuredSocialSecurityNumberArray[0])
          .withDateOfBirth(AccountFactory.date)
          .withAddress1(AccountFactory.AddressLine1Array[0])
          .withAddress2(AccountFactory.AddressLine2Array[0])
          .withAddresscity(AccountFactory.AddressCityArray[0])
          .withAddressState(AccountFactory.AddressStateArray[0] as String)
          .withAddressZip(AccountFactory.AddressZipArray[0])
          .withPolicyState(AccountFactory.AddressStateArray[0] as String)
          .withCacheExpireDate(AccountFactory.date)
          .withPublicId(AccountFactory.date as String)
          .withPriorAddressLine1(AccountFactory.AddressLine1Array[0])
          .withPriorAddressLine2(AccountFactory.AddressLine2Array[0])
          .withPriorAddressCity(AccountFactory.AddressCityArray[0])
          .withPriorAddressState(AccountFactory.AddressStateArray[0] as String)
          .withPriorAddressZip(AccountFactory.AddressZipArray[0])
          .create()
          
    assertNotNull(req)
    assertEquals(AccountFactory.FirstNameArray[0], req.FirstName)
    assertNull(req.MiddleName)
    assertEquals(AccountFactory.LastNameArray[0], req.LastName)
    assertEquals(AccountFactory.IsuredSocialSecurityNumberArray[0], req.SocialSecurityNumber)
    assertEquals(AccountFactory.date, req.DateOfBirth)
    assertEquals(AccountFactory.AddressLine1Array[0], req.AddressLine1)
    assertEquals(AccountFactory.AddressLine2Array[0], req.AddressLine2)
    assertEquals(AccountFactory.AddressCityArray[0], req.AddressCity)
    assertEquals(AccountFactory.AddressStateArray[0], req.AddressState)
    assertEquals(AccountFactory.AddressZipArray[0], req.AddressZip)
    assertEquals(AccountFactory.AddressStateArray[0], req.PolicyState)
    assertEquals(AccountFactory.date, req.CacheExpireDate)
    assertEquals(AccountFactory.date as String, req.PublicID)
    assertEquals(AccountFactory.AddressLine1Array[0], req.PriorAddressLine1)
    assertEquals(AccountFactory.AddressLine2Array[0], req.PriorAddressLine2)
    assertEquals(AccountFactory.AddressCityArray[0], req.PriorAddressCity)
    assertEquals(AccountFactory.AddressStateArray[0] as String, req.PriorAddressState)
    assertEquals(AccountFactory.AddressZipArray[0], req.PriorAddressZip)
  }
}
