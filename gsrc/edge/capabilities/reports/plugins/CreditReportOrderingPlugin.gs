package edge.capabilities.reports.plugins

uses edge.di.annotations.InjectableNode
uses edge.capabilities.reports.dto.ReportResponseDTO
uses edge.capabilities.reports.dto.credit.CreditReportRequestDTO
uses edge.exception.IllegalStateException

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/21/17
 * Time: 1:46 PM
 * To change this template use File | Settings | File Templates.
 */
class CreditReportOrderingPlugin extends ReportOrderingPlugin<CreditReportRequestDTO, ReportResponseDTO> {
  private var _request : CreditReportRequestDTO

  @InjectableNode
  construct(){}

  override function orderReport(reportRequest : CreditReportRequestDTO) : ReportResponseDTO{
    _request = reportRequest
    return super.orderReport(reportRequest)
  }

  override function executeReportOrder() {
    una.pageprocess.credit.CreditReportScreen.orderCreditReport(CreditContact, PortalJob.SelectedVersion, false, false, null, null, null, null)
  }

  override function toResponseDTO(): ReportResponseDTO {
    return new ReportResponseDTO(){: ReportStatus = PortalJob.LatestPeriod.CreditInfoExt.CreditReport.CreditStatus.Code}
  }

  private property get CreditContact() : PolicyContactRole{
    var result : PolicyContactRole

    switch(_request.CreditOrderingContact){
      case TC_PNI:
        result = PortalJob.LatestPeriod.PrimaryNamedInsured
        break
      case TC_CONI:
        result = PortalJob.LatestPeriod.NamedInsureds.whereTypeIs(PolicyAddlNamedInsured).first() //TODO tlv this will change once we get an idea of the priority of additional named insured types
        break
    }

    if(result == null){
      throw new IllegalStateException(){:Message = "Cannot find a policy contact for the typekey value ${_request.CreditOrderingContact}"}
    }

    return result
  }
}