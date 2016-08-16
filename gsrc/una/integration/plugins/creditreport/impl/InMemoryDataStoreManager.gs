package una.integration.plugins.creditreport.impl

uses java.util.ArrayList
uses una.integration.plugins.creditreport.ICreditReportDataManager
uses gw.api.util.Logger
uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.mapping.creditreport.CreditReportResponse

class InMemoryDataStoreManager implements ICreditReportDataManager {

  private static final var _logger = Logger.forCategory("InMemoryDataStoreManager")

  // Represents a cached credit report/score in the external credit reporting service.
  static private class CachedCreditReport {
 
     private var _firstName : String as FirstName
     private var _middleName : String as MiddleName
     private var _lastName : String as LastName
     private var _addressLine1 : String as AddressLine1
     private var _addressCity : String as AddressCity
     private var _addressState : State as AddressState
     private var _addressZip : String as AddressZip
     private var _creditScore : String as CreditScore
     private var _creditDate : java.util.Date as CreditDate
     private var _statusCode : CreditStatusExt as StatusCode
     private var _statusDescription : String as StatusDescription
  }

  /**
   * Keep a local cache of credit reports.
   * In an actual credit reporting service, credit scores would be cached for use by other applications.
   * The service would check the cache before requesting a customer's credit report from Experian, etc.
   */ 
  private static var _localCache = new ArrayList<CachedCreditReport>()

  /**
   * Queries the local cache to see if a credit score has already been retrieved.
   */
  @Param("rqst", "Instance of CreditReportRequest")
  @Returns("Cache credit report previously saved or null if not found in cache")
  private function queryLocalCacheForCreditScore(rqst : CreditReportRequest) : CachedCreditReport {

    var result : CachedCreditReport = null
    
    var foundResults : List<CachedCreditReport> = null
    if (!_localCache.Empty) {
        _logger.debug("Querying cache for credit score for: " + rqst.FirstName + " " + rqst.LastName)
        foundResults = _localCache.where(\ r -> 
            r.FirstName == rqst.FirstName 
            && (rqst.MiddleName == null ||  r.MiddleName == rqst.MiddleName)
            && r.LastName == rqst.LastName
            && r.AddressCity == rqst.AddressCity
            && r.AddressLine1 == rqst.AddressLine1
            && r.AddressState == rqst.AddressState
            && r.AddressZip == rqst.AddressZip
            && r.CreditDate > rqst.CacheExpireDate)
        _logger.debug("Found " + foundResults.Count + " credit report(s) in local cache.")
        if (foundResults.Count > 0) {
          result = foundResults.get(0)
        }
    }
    
    return result
  }

  /**
   * Checks local cache for existing (non-stale) credit report.
   */
  @Param("rqst", "Instance of CreditReportRequest")
  @Returns("Cache credit report previously saved or null if not found in cache")
  override function getRecordFromLocalDataStore(rqst : CreditReportRequest) : CreditReportResponse {
       
    var cachedResponse : CreditReportResponse = null
    var cachedRecord : CachedCreditReport = null
    _logger.debug("Local cache contains " + _localCache.size() + " scores.")
    
    if(rqst != null) {
      cachedRecord = queryLocalCacheForCreditScore(rqst)
      if (cachedRecord != null) {
          _logger.info("Found cached credit report for individual: " + rqst.FirstName + " " + rqst.LastName)
          cachedResponse = new CreditReportResponse()
          cachedResponse.Score = cachedRecord.CreditScore
          cachedResponse.ScoreDate = cachedRecord.CreditDate
          cachedResponse.StatusCode = cachedRecord.StatusCode
          cachedResponse.StatusDescription = cachedRecord.StatusDescription
      }
      else {
        _logger.debug("getRecordFromLocalDataStore(): Local record is not found")
      }
    }
    
    return cachedResponse
  }

  /**
   * Add a credit score to the local cache.
   */
  @Param("rqst", "Instance of report request")
  @Param("response", "Instance of report response")
  override function addReportToLocalDataStore(rqst : CreditReportRequest, response : CreditReportResponse) {
    
    // Remove existing report from cache
    var existingCacheRecord = queryLocalCacheForCreditScore(rqst)
    if (existingCacheRecord != null) {
      _localCache.remove(existingCacheRecord)
    }
    
    // Create new report and store in cache
    var newCacheRecord = new CachedCreditReport()
    newCacheRecord.AddressCity = rqst.AddressCity
    newCacheRecord.AddressLine1 = rqst.AddressLine1
    newCacheRecord.AddressState = rqst.AddressState
    newCacheRecord.AddressZip = rqst.AddressZip
    newCacheRecord.CreditDate = new java.util.Date()
    newCacheRecord.CreditScore = response.Score
    newCacheRecord.FirstName = rqst.FirstName
    newCacheRecord.MiddleName = rqst.MiddleName
    newCacheRecord.LastName = rqst.LastName
    newCacheRecord.StatusCode = response.StatusCode
    newCacheRecord.StatusDescription = response.StatusDescription
    _localCache.add(newCacheRecord)
    
    _logger.info("Adding credit score to local cache: " + rqst.FirstName + " " + rqst.LastName)
  }
}
