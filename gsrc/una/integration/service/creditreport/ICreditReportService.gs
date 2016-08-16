package una.integration.service.creditreport

uses una.integration.mapping.creditreport.CreditReportResponse
uses una.integration.mapping.creditreport.CreditReportRequest

/**
 * Services that will be delegating request to the external system have to implement this interface
 */
interface ICreditReportService {
        
  /**
   * In production would delegate the request to the external system to get the report
   */    
  @Param("rqst", "Instance of CreditReportRequest")
  @Returns("Instance of Credit report previously")
  function getCreditReport(request : CreditReportRequest) : CreditReportResponse

}
