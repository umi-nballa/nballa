package una.integration.service.creditreport.mock

uses gw.api.util.Logger
uses java.util.Calendar
uses una.integration.plugins.creditreport.ICreditReportDataManager
uses una.integration.plugins.creditreport.CreditReportDataManagerFactory
uses una.integration.service.creditreport.ICreditReportService
uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.mapping.creditreport.CreditReportRequest

/**
 * Returns hardwired response 
 */
class CreditReportServiceMock implements ICreditReportService {

  private static final var _logger = Logger.forCategory("CreditReportServiceMock")

  private var _creditReportDataMgr : ICreditReportDataManager
  
  construct() {
    
    _creditReportDataMgr = CreditReportDataManagerFactory.getCreditReportDataManager(typekey.CreditReportDMExt.TC_PERSISTENT)
  }
  
  /**
   * In production would delegate the request to the external system to get the report
   */
  @Param("rqst", "Instance of report request")
  override function getCreditReport(rqst: CreditReportRequest): CreditReportResponse {
    _logger.debug("Entering method getCreditReport()")

    var response: CreditReportResponse = null

    if (rqst != null) {
      // Check for a cached credit score
      response = _creditReportDataMgr.getRecordFromLocalDataStore(rqst)
      if (response == null) {
        response = new CreditReportResponse()
        response.CreditBureau = "Experian"
        response.ScoreDate = Calendar.getInstance().Time
        response.FolderID = "100"
        response.FirstName = rqst.FirstName
        response.LastName = rqst.LastName
        response.MiddleName = rqst.MiddleName
        response.AddressLine1 = rqst.AddressLine1
        response.AddressCity = rqst.AddressCity
        response.AddressState = rqst.AddressState
        response.AddressZip = rqst.AddressZip

        // Here are some unit test cases that return different scores/result codes.
        if (rqst.FirstName == "Bob") {
          response.StatusDescription = "No credit found for individual: " + rqst.FirstName + " " + rqst.LastName
          response.StatusCode = CreditStatusExt.TC_NO_HIT
        } else if (rqst.FirstName == "Cathy") {
          response.Score = "800"
          response.StatusCode = CreditStatusExt.TC_CREDIT_RECEIVED
          response.StatusDescription = "Credit score retrieved: " + response.getScore()
        } else if (rqst.FirstName == "Debra") {
          response.Score = "500"
          response.StatusCode = CreditStatusExt.TC_CREDIT_RECEIVED
          response.StatusDescription = "Credit score retrieved: " + response.getScore()
        } else if (rqst.FirstName == "Keith") {
          response.StatusCode = CreditStatusExt.TC_ERROR
          response.StatusDescription = "Credit service is down"
          _logger.error("Credit service not available!")
        } else {
          response.Score = "555"
          response.StatusCode = CreditStatusExt.TC_CREDIT_RECEIVED
          response.StatusDescription = "Credit score retrieved: " + response.getScore()
        }
        // Add new record to cache
        if (response.StatusCode == CreditStatusExt.TC_CREDIT_RECEIVED) {
          _creditReportDataMgr.addReportToLocalDataStore(rqst, response)
        }
      }
    }
    _logger.debug("Exiting method getCreditReport()")

    return response
  }

}
