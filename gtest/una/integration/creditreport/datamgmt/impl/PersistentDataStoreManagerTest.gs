package una.integration.creditreport.datamgmt.impl

uses una.integration.mapping.creditreport.CreditReportRequest
uses entity.CreditReportExt
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.creditreport.testutil.CreditReportFactory
uses una.integration.plugins.creditreport.impl.PersistentDataStoreManager


@gw.testharness.ServerTest
class PersistentDataStoreManagerTest extends gw.testharness.TestBase {

  static var ds : PersistentDataStoreManager
 
  override function beforeClass() {
    
    ds = new PersistentDataStoreManager()
  }
  
  function testGetRecordFromLocalDataStorePositive() {
    
    CreditReportFactory.createPersistentRecordCache(0)
    assertNotNull(ds.getRecordFromLocalDataStore(CreditReportFactory.createCreditReportRequest(0)))
  }
  
  function testGetRecordFromLocalDataStoreNegative() {
    
    CreditReportFactory.createPersistentRecordCache(0)
    assertNull(ds.getRecordFromLocalDataStore(CreditReportFactory.createCreditReportRequest(1)))
  }
  
  function testGetRecordFromLocalDataStoreNull() {
    
    assertNull(ds.getRecordFromLocalDataStore(null))
  }  
}
