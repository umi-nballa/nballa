package una.integration.plugins.creditreport

uses una.integration.plugins.creditreport.impl.InMemoryDataStoreManager
uses una.integration.plugins.creditreport.impl.PersistentDataStoreManager

/**
 * Factory class to return instance of the class that implements ICreditReportDataManager interface
 */
class CreditReportDataManagerFactory {

  /**
   * Instantiates class implementing CreditReportDataManager Interface
   * returns CreditReportDataManager for purposes of reference implementation
   */
  @Param("kind", "typekey of data store manager to use")
  @Returns("Instance of data store manager")
  static function getCreditReportDataManager(kind : typekey.CreditReportDMExt) : ICreditReportDataManager {
    
    var result : ICreditReportDataManager = null
    
    switch(kind) {
              
      case typekey.CreditReportDMExt.TC_MEMORY:
        result = new InMemoryDataStoreManager()
        break
        
      case typekey.CreditReportDMExt.TC_PERSISTENT:
        result = new PersistentDataStoreManager()
        break
    }

    return result
  }
}
