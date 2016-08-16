package una.integration.creditreport.datamgmt.impl

uses una.integration.mapping.creditreport.CreditReportResponse
uses java.util.List
uses una.integration.creditreport.testutil.CreditReportFactory
uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.plugins.creditreport.impl.InMemoryDataStoreManager
uses java.util.Date
uses java.lang.Throwable


@gw.testharness.ServerTest
class InMemoryDataStoreManagerTest extends gw.testharness.TestBase {

  static var ds : InMemoryDataStoreManager
 
  override function beforeClass() {
    
    ds = new InMemoryDataStoreManager()
  }
  
  override function afterMethod(e : Throwable) {
    
    var localCache : List
        
    for(prop in InMemoryDataStoreManager.Type.TypeInfo.DeclaredProperties) {
      if(prop.Name == "_localCache") {
        localCache = prop.Accessor.getValue(ds) as List
        for(i in localCache) {
          localCache.remove(i)
        }        
      }
    }
  }  
  
  private function initLocalCache(num : int) {

    var localCache : List
        
    for(prop in InMemoryDataStoreManager.Type.TypeInfo.DeclaredProperties) {
      if(prop.Name == "_localCache") {
        localCache=prop.Accessor.getValue(ds) as List
      }
    }
    if(num >= 0 && num < 10) {
      localCache.add(CreditReportFactory.createMemoryRecordCache(num))
    }    
  }
  
  function testGetRecordFromLocalDataStoreFound() {
    
    initLocalCache(0)
    var request = CreditReportFactory.createCreditReportRequest(0)
    request.CacheExpireDate = gw.api.util.DateUtil.addDays(new java.util.Date(), -1)
    assertNotNull(ds.getRecordFromLocalDataStore(request))
  }
  
  function testGetRecordFromLocalDataStoreNotFound() {
    
    initLocalCache(0)
    var request = CreditReportFactory.createCreditReportRequest(1)
    assertNull(ds.getRecordFromLocalDataStore(request))
  }  
  
  function testGetRecordFromLocalDataStoreNull() {
    
    initLocalCache(0)
    assertNull(ds.getRecordFromLocalDataStore(null))
  }    
}
