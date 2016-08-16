package una.integration.plugins.creditreport

uses una.integration.mapping.creditreport.CreditReportRequest
uses una.integration.mapping.creditreport.CreditReportResponse

/**
 * This forms contract for various Data management implementation for storing CreditReport
 * An example implementation shows an in-memory cache used to store reports. On the field this can be replaced by persistent data store manager
 */
interface ICreditReportDataManager {
  
  @Param("rqst", "Instance of CreditReportRequest")
  @Returns("Cache credit report previously saved or null if not found in cache")
  function getRecordFromLocalDataStore(rqst : CreditReportRequest) : CreditReportResponse
  
  @Param("rqst", "Instance of CreditReportRequest")
  @Param("response", "Instance of report response")
  function addReportToLocalDataStore(rqst : CreditReportRequest, response : CreditReportResponse)
}
