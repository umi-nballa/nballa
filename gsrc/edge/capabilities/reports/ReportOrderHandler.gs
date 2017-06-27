package edge.capabilities.reports

uses edge.jsonrpc.IRpcHandler
uses edge.di.annotations.InjectableNode
uses edge.jsonrpc.annotation.JsonRpcRunAsInternalGWUser
uses edge.security.authorization.IAuthorizerProviderPlugin
uses edge.jsonrpc.annotation.JsonRpcMethod
uses edge.capabilities.reports.dto.ReportRequestDTO
uses edge.capabilities.reports.dto.ReportResponseDTO
uses edge.capabilities.reports.plugins.ReportOrderingPlugin
uses java.util.Map
uses gw.lang.reflect.IType
uses edge.capabilities.reports.plugins.CreditReportOrderingPlugin
uses edge.capabilities.reports.plugins.CLUEReportOrderingPlugin
uses edge.capabilities.reports.dto.credit.CreditReportRequestDTO
uses edge.capabilities.reports.dto.clue.CLUEReportResponseDTO

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/15/17
 * Time: 12:07 AM
 * To change this template use File | Settings | File Templates.
 *
 * Generic handler for report ordering.  To add functionality to this;
 * 1.  Develop and provide an implementation of IReportOrderingPlugin or an extension of ReportOrderingPlugin
 * 2.  Add the order call for the new report.
 * 3.  Add the report plugin type and jobs to the Authorization map (REPORT_TO_JOB_TYPES_AUTHORIZATION)
 * 4.  Create a new [reportname]report.properties file
 */
class ReportOrderHandler implements IRpcHandler{
  //we are not validating credit currently for Renewals because we do not support renewal job alterations
  //through the portal.  Besides that, Renewals are normally automated anyways
  private final var REPORT_TO_JOB_TYPES_AUTHORIZATION : Map<IType, List<IType>> = {CreditReportOrderingPlugin -> {Submission},
                                                                                   CLUEReportOrderingPlugin -> {Submission}}

  /**
  * Report ordering plugin
  */
  private var _reportOrderingPlugin : ReportOrderingPlugin

  @InjectableNode
  @JsonRpcRunAsInternalGWUser
  @Param("reportOrderingPlugin", "Report Ordering Plugin")
  @Param("authorizer", "Authorizer added to check user can retrieve submission")
  construct(reportOrderingPlugin : ReportOrderingPlugin, authorizer : IAuthorizerProviderPlugin) {
    var jobsToAuthorizeFor = REPORT_TO_JOB_TYPES_AUTHORIZATION.get(reportOrderingPlugin.IntrinsicType)

    jobsToAuthorizeFor.each( \ jobType -> {
      authorizer.authorizerFor(jobType)
    })

    this._reportOrderingPlugin = reportOrderingPlugin
  }

  /**
   * Orders a Credit Report report based on request param
   *
   * @param  reportRequest the Request Data
   * @return     The response Data
   */
  @JsonRpcMethod
  public function orderCreditReport(reportRequest : CreditReportRequestDTO) : ReportResponseDTO {
    return _reportOrderingPlugin.orderReport(reportRequest)
  }

  /**
   * Orders a CLUE Report report based on request param
   *
   * @param  reportRequest the Request Data
   * @return     The response Data
   */
  @JsonRpcMethod
  public function orderCLUEReport(reportRequest : ReportRequestDTO) : CLUEReportResponseDTO {
    return _reportOrderingPlugin.orderReport(reportRequest) as CLUEReportResponseDTO
  }
}