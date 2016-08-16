package una.integration.creditreport.datamgmt

uses una.integration.plugins.creditreport.ICreditReportDataManager
uses typekey.CreditReportDMExt
uses una.integration.plugins.creditreport.impl.InMemoryDataStoreManager
uses una.integration.plugins.creditreport.impl.PersistentDataStoreManager
uses una.integration.plugins.creditreport.CreditReportDataManagerFactory

@gw.testharness.ServerTest
class CreditReportDataManagerFactoryTest extends gw.testharness.TestBase {

  function testGetCreditReportDataManagerPersistent() {

    var service = CreditReportDataManagerFactory.getCreditReportDataManager(typekey.CreditReportDMExt.TC_PERSISTENT)
    
    assertTrue(service typeis PersistentDataStoreManager)
  }
  
  function testgetCreditReportDataManagerMemory() {
  
    var service = CreditReportDataManagerFactory.getCreditReportDataManager(typekey.CreditReportDMExt.TC_MEMORY)
    
    assertTrue(service typeis InMemoryDataStoreManager)
  }
  
  function testgetCreditReportDataManagerNull() {
  
    var service = CreditReportDataManagerFactory.getCreditReportDataManager(null)
    
    assertNull(service)
  }
}
