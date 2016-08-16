package una.integration.creditreport.service.ncf

uses typekey.CreditReportServiceExt
uses typekey.CreditStatusExt

uses una.integration.service.creditreport.ICreditReportService
uses una.integration.service.creditreport.CreditReportServiceFactory
uses una.integration.creditreport.testutil.CreditReportFactory

@gw.testharness.ServerTest
class NCFCreditReportServiceTest extends gw.testharness.TestBase {

  static var service : ICreditReportService
  
  override function beforeClass() {
    
    service = CreditReportServiceFactory.getCreditReportService(typekey.CreditReportServiceExt.TC_NCF)
  }
    
  function testGetCreditReportNoHit() {
    
    var req = CreditReportFactory.createCreditReportRequest(0)
    req.CacheExpireDate = gw.api.util.DateUtil.addMonths(new java.util.Date(), -1)
    var resp = service.getCreditReport(req)
    assertEquals(typekey.CreditStatusExt.TC_NO_HIT, resp.StatusCode)
  }
  
  function testGetCreditReportScored() {
    
    var req = CreditReportFactory.createCreditReportRequest(1)
    req.CacheExpireDate = gw.api.util.DateUtil.addMonths(new java.util.Date(), -1)
    var resp = service.getCreditReport(req)
    assertEquals(typekey.CreditStatusExt.TC_CREDIT_RECEIVED_WITH_REASON_ENTRY, resp.StatusCode)
  }
  
  function testGetCreditReportScoredWithAddressDiscrepancy() {
    
    var req = CreditReportFactory.createCreditReportRequest(3)
    req.CacheExpireDate = gw.api.util.DateUtil.addMonths(new java.util.Date(), -1)
    var resp = service.getCreditReport(req)
    assertTrue(resp.AddressDiscrepancyInd)
  }
  
  function testGetCreditReportNull() {
    
    var req = CreditReportFactory.createCreditReportRequest(1)
    req.CacheExpireDate = gw.api.util.DateUtil.addMonths(new java.util.Date(), -1)
    var resp = service.getCreditReport(null)
    assertEquals("Error obtaining credit report.", resp.StatusDescription)
  }
}
