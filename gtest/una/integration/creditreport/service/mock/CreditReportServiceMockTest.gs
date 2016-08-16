package una.integration.creditreport.service.mock

uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.creditreport.testutil.CreditReportFactory
uses una.integration.service.creditreport.mock.CreditReportServiceMock

@gw.testharness.ServerTest
class CreditReportServiceMockTest extends gw.testharness.TestBase {
 
  function testGetCreditReport() {
    
    var req = CreditReportFactory.createCreditReportRequest(5)
    var mock = new CreditReportServiceMock()
    assertNotNull(mock.getCreditReport(req))
  }
  
  function testGetCreditReportNull() {
    
    var mock = new CreditReportServiceMock()
    assertNull(mock.getCreditReport(null))
  }  
}
