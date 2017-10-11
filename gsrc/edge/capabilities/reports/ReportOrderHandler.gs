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
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.PlatformSupport.Bundle
uses edge.capabilities.quote.lob.homeowners.draft.mappers.EdgePolicyContactMapper
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalNamedInsuredMapper

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

  private var _accountContactPlugin : IAccountContactPlugin

  @InjectableNode
  @JsonRpcRunAsInternalGWUser
  @Param("reportOrderingPlugin", "Report Ordering Plugin")
  @Param("authorizer", "Authorizer added to check user can retrieve submission")
  construct(reportOrderingPlugin : ReportOrderingPlugin, authorizer : IAuthorizerProviderPlugin, accountContactPlugin : IAccountContactPlugin) {
    var jobsToAuthorizeFor = REPORT_TO_JOB_TYPES_AUTHORIZATION.get(reportOrderingPlugin.IntrinsicType)

    jobsToAuthorizeFor.each( \ jobType -> {
      authorizer.authorizerFor(jobType)
    })

    this._accountContactPlugin = accountContactPlugin
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
    var job = _reportOrderingPlugin.getJobByNumber(reportRequest.JobNumber)
    //first update contact data then order.  needed because portal will not save prior to this.

    Bundle.transaction( \ bundle -> {
      job = bundle.add(job)
        if(reportRequest.PrimaryInsured != null){
          _accountContactPlugin.updateContact(job.SelectedVersion.PrimaryNamedInsured.ContactDenorm, reportRequest.PrimaryInsured)
        }

        if(reportRequest.CoInsured != null){
          var coInsuredContact = job.SelectedVersion.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)?.atMostOneWhere( \ contact -> contact.ContactDenorm.PortalHash_Ext == reportRequest.CoInsured.Contact.PortalContactHash)
          var additionalInsuredMapper = new PolicyAdditionalNamedInsuredMapper()

          if(coInsuredContact == null){
            var previousIndex = job.SelectedVersion.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)?.orderByDescending(\ pcr -> pcr.PortalIndex)?.first().PortalIndex
            additionalInsuredMapper.createContact(job.SelectedVersion, previousIndex, reportRequest.CoInsured)
            coInsuredContact = job.SelectedVersion.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured)?.atMostOneWhere( \ contact -> contact.ContactDenorm.PortalHash_Ext == reportRequest.CoInsured.Contact.PortalContactHash) //re-retrieve to populate null entity
          }

          additionalInsuredMapper.updateContactRole(coInsuredContact, reportRequest.CoInsured)
        }
    })


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