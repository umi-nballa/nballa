package una.integration.creditreport.service

uses typekey.CreditReportServiceExt
uses una.integration.service.creditreport.CreditReportServiceFactory
uses una.integration.service.creditreport.mock.CreditReportServiceMock
uses una.integration.service.creditreport.ncf.NCFCreditReportService

@gw.testharness.ServerTest
class CreditReportServiceFactoryTest extends gw.testharness.TestBase {
  
  function testGetCreditReportServiceMock() {
  
    var service = CreditReportServiceFactory.getCreditReportService(typekey.CreditReportServiceExt.TC_MOCK)
    
    assertTrue(service typeis CreditReportServiceMock)
  }
  
  function testGetCreditReportServiceStub() {
  
    var service = CreditReportServiceFactory.getCreditReportService(typekey.CreditReportServiceExt.TC_NCF)
    
    assertTrue(service typeis NCFCreditReportService)
  }
  
  function testGetCreditReportServiceNull() {
  
    var service = CreditReportServiceFactory.getCreditReportService(null)
    
    assertNull(service)
  }
}
