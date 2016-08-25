package una.integration.plugins.creditreport.impl

uses gw.api.database.Query
uses gw.api.util.Logger
uses una.integration.plugins.creditreport.ICreditReportDataManager
uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.logging.UnaLoggerCategory

/**
 * Shows an example implementation of using a persistent data store in PC DB
 * Please note that most of the times at client side it is preferred and recommended to use data store external to PC
 */
class PersistentDataStoreManager implements ICreditReportDataManager {

  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION

  /**
   * Queries the local cache to see if a credit score has already been retrieved
   */
  @Param("rqst", "Instance of report request")
  @Returns("Cache credit report previously saved or null if not found in cache")
  private static function queryLocalCacheForCreditScore(rqst : CreditReportRequest) : CreditReportExt {
    
    LOGGER.debug("Querying cache for credit score for: " + rqst.FirstName + " " + rqst.LastName)

    var result : CreditReportExt = null    
    var q = Query.make(CreditReportExt)
    var r = q.compare("FirstName", Equals, rqst.FirstName)
    if(rqst.MiddleName != null) {
      r = r.compare("MiddleName", Equals, rqst.MiddleName)
    }
    r = r.compare("LastName", Equals, rqst.LastName)
    r = r.compare("AddressLine1", Equals, rqst.AddressLine1)
         .compare("AddressCity", Equals, rqst.AddressCity)
         .compare("AddressState", Equals, rqst.AddressState)
         .compare("AddressZip", Equals, rqst.AddressZip)
         .compare("CreditScoreDate", GreaterThan, rqst.CacheExpireDate)
    result = q.select().FirstResult
    
    LOGGER.debug("Found credit report in local store, score = "+result.CreditScore)
    
    return result
  }

  /**
   * Checks local cache for existing (non-stale) credit report
   */
  @Param("rqst", "Instance of report request")
  @Returns("Cache credit report previously saved or null if not found in cache")
  override function getRecordFromLocalDataStore(rqst : CreditReportRequest) : CreditReportResponse {
        
    var cachedResponse : CreditReportResponse = null
    var persistentRecord : CreditReportExt = null
    persistentRecord = queryLocalCacheForCreditScore(rqst)

    if (persistentRecord != null) {
        LOGGER.info("Found cached credit report for individual: " + rqst.FirstName + " " + rqst.LastName)
        
        cachedResponse = new CreditReportResponse
                              .Builder()
                              .withFirstName(rqst.FirstName)
                              .withMiddleName(rqst.MiddleName)
                              .withLastName(rqst.LastName)
                              .withAddress1(rqst.AddressLine1)
                              .withAddresscity(rqst.AddressCity)
                              .withAddressState(rqst.AddressState as java.lang.String)
                              .withAddressZip(rqst.AddressZip)
                              .withScore(persistentRecord.CreditScore)
                              .withScoreDate(persistentRecord.CreditScoreDate)
                              .withStatusCode(persistentRecord.CreditStatus)
                              .withStatusDescription(persistentRecord.CreditStatusDescription)
                              .create()       
    }
    else {
      LOGGER.debug("getCreditReportResponse(): Local record is not found")
    }
    
    return cachedResponse
  }

  /**
   * Add a credit score to the local cache
   */
  @Param("rqst", "Instance of report request")
  @Param("response", "Instance of report response")
  override function addReportToLocalDataStore(rqst : CreditReportRequest, response : CreditReportResponse) {
    // No implementation is needed for this as the record gets stored in DB by transaction of the caller
  }
}
