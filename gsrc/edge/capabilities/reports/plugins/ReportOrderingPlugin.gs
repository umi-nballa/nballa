package edge.capabilities.reports.plugins

uses gw.api.database.Query
uses edge.exception.EntityNotFoundException
uses edge.capabilities.reports.dto.ReportRequestDTO
uses edge.capabilities.reports.dto.ReportResponseDTO
uses edge.PlatformSupport.Bundle
uses edge.exception.IllegalStateException

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/22/17
 * Time: 12:18 PM
 *
 * This partial implementation of a report ordering plugin assumes there is already a job in-flight.
 * When extending this partial implementation, the concretion should:
 *  1.  Provide the type of Report Request and Response DTOs being used
 *  2.  Implement the orderReport() function
 *  3.  Implement and provide the actual internal ordering code in executeReportOrder()
 *  4.  Implement and provide the transformation code to DTO in toResponseDTO()
 */
abstract class ReportOrderingPlugin <T extends ReportRequestDTO, E extends ReportResponseDTO>{
  private var _job : Job as PortalJob
  private var _accountNumber : String as AccountNumber

  function orderReport(reportRequest : T) : E{
    _job = getJobByNumber(reportRequest.JobNumber)
    _accountNumber = reportRequest.AccountNumber

    Bundle.transaction( \ bundle -> {
      _job = bundle.add(_job)
      executeReportOrder()
    })

    return toResponseDTO()
  }

  abstract function toResponseDTO() : E
  abstract protected function executeReportOrder()

  /**
   * Fetches a job by its number.
   */
  private function getJobByNumber(jobNumber: String) : Job {
    var result = Query.make(Job).compare("JobNumber", Equals, jobNumber).select().FirstResult

    if (result == null  ){
      throw new EntityNotFoundException() {: Message = "Job ${jobNumber} not found." }
    }else if(!PolicyPeriodStatus.TF_OPEN.TypeKeys.contains(result.SelectedVersion.Status)){
      throw new IllegalStateException(){:Message = "Job ${jobNumber} is no longer in an editable state."}
    }

    return result
  }
}