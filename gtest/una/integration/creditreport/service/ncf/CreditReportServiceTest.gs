package una.integration.creditreport.service.ncf

uses typekey.CreditReportServiceExt
uses typekey.UWCompanyCode
uses entity.CreditReportParametersExt
uses typekey.State
uses typekey.CreditStatusExt
uses typekey.Jurisdiction

uses una.integration.service.creditreport.CreditReportServiceFactory
uses una.integration.framework.util.CreditReportUtil
uses una.integration.creditreport.testutil.AccountFactory
uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.service.creditreport.ICreditReportService

@gw.testharness.ServerTest
class CreditReportServiceTest extends gw.testharness.TestBase { 

 function testService() {
   
    var service = CreditReportServiceFactory.getCreditReportService(typekey.CreditReportServiceExt.TC_NCF)    
    assertNotNull(service)
 }
 
  /**
   *  This certainly needs to be adjusted with finalized system table entries
   */
  function testCreditReportParameters() {
    var creditReportParametersExt : CreditReportParametersExt = CreditReportUtil.getCreditReportParameters(
            AccountFactory.lob, 
            AccountFactory.uwCponpanyCode, // ACME Low Hazard Insurane
            AccountFactory.jurisdictionCode         // California
    )

    assertNotNull(creditReportParametersExt)
  }

  /**
   *   Ideally this routine gets refactored and  re-used by fetching 
   *   test records from a file
   */
  function testRequestSubmit_VA_Resident_Multiple_Name_Entry_from_Vendor() {

    var request  : CreditReportRequest
    var response : CreditReportResponse

    // Expiration date settings are maintained in CreditReportParameters system table.
    var creditReportParameters = CreditReportUtil.getCreditReportParameters(
            AccountFactory.lob, 
            AccountFactory.uwCponpanyCode,  // ACME Low Hazard Insurane
            AccountFactory.jurisdictionCode  // California
          )
    
    // Use the role contact's public ID as among the identifier to the request
    var publicId = java.util.Date.CurrentDate.Time as String

    // Calculate and set the new report required date as -X days from today's date
    var cacheExpireDate = gw.api.util.DateUtil.addDays(new java.util.Date(), -1 * (creditReportParameters.CreditReportDaysValid))
    
    var service : ICreditReportService = CreditReportServiceFactory.getCreditReportService(typekey.CreditReportServiceExt.TC_NCF)
   
    // This data was taken from LexisNexis' test data website 
    request =  
      new CreditReportRequest
        .Builder()
        .withFirstName(AccountFactory.FirstNameArray[2])
        .withMiddleName(AccountFactory.MiddleNameArray[2])
        .withLastName(AccountFactory.LastNameArray[2])
        .withAddress1(AccountFactory.AddressLine1Array[2])
        .withAddress2(null)
        .withAddresscity(AccountFactory.AddressCityArray[2])
        .withAddressState(AccountFactory.AddressStateArray[2] as String)
        .withAddressZip(AccountFactory.AddressZipArray[2])
        .withCacheExpireDate(cacheExpireDate)
        .create()    
    
    assertNotNull(request)
    
    response = service.getCreditReport(request)
    
    assertTrue(response.Score.length == 3)
    assertEquals(AccountFactory.CreditBureau,  response.CreditBureau)
    assertTrue(response.Reasons.Count > 0)
    assertEquals(request.FirstName, response.FirstName)
    assertEquals(request.LastName, response.LastName)
    assertEquals(request.AddressCity, response.AddressCity)
    assertEquals(request.AddressState, response.AddressState)
    assertTrue(response.AddressDiscrepancyInd)
    assertFalse(response.StatusCode.compareTo(CreditStatusExt.TC_ERROR) == 0)
  }
 
  /**
   *  
   */
  function testRequestSubmit_VA_Resident_With_Address2() {
 
    var creditRequest : CreditReportRequest
    var response : CreditReportResponse

    // Expiration date settings are maintained in CreditReportParameters system table.
    var creditReportParameters = CreditReportUtil.getCreditReportParameters(
            AccountFactory.lob, 
            AccountFactory.uwCponpanyCode,  // ACME Low Hazard Insurane
            AccountFactory.jurisdictionCode  // California
          )
    
    // Use the role contact's public ID as among the identifier to the request
    //var publicId = java.util.Date.CurrentDate.Time as String

    // Calculate and set the new report required date as -X days from today's date
    var cacheExpireDate = gw.api.util.DateUtil.addDays(new java.util.Date(), -1 * (creditReportParameters.CreditReportDaysValid))
    
    var service  : ICreditReportService = CreditReportServiceFactory.getCreditReportService(typekey.CreditReportServiceExt.TC_NCF)
   
    // This data was taken from LexisNexis' test data website 
    creditRequest =
      new CreditReportRequest
        .Builder()
        .withFirstName(AccountFactory.FirstNameArray[3])
        .withMiddleName(AccountFactory.MiddleNameArray[3])
        .withLastName(AccountFactory.LastNameArray[3])
        .withAddress1(AccountFactory.AddressLine1Array[3])
        .withAddress2(AccountFactory.AddressLine2Array[3])
        .withAddresscity(AccountFactory.AddressCityArray[3])
        .withAddressState(AccountFactory.AddressStateArray[3] as String)
        .withAddressZip(AccountFactory.AddressZipArray[3])
        .withCacheExpireDate(cacheExpireDate)
        .create()    
    
    assertNotNull( creditRequest )
    
    response = service.getCreditReport( creditRequest )
    
    assertTrue(response.Score.length==3)
    assertEquals(AccountFactory.CreditBureau,  response.CreditBureau)
    assertTrue(response.Reasons.Count > 0)
    assertEquals(creditRequest.FirstName, response.FirstName)
    assertEquals(creditRequest.LastName, response.LastName)
    assertEquals(creditRequest.AddressCity, response.AddressCity)
    assertEquals(creditRequest.AddressState, response.AddressState)
    assertTrue(response.AddressDiscrepancyInd)
  }
}