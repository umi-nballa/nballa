package edge.capabilities.reports.dto.credit

uses edge.capabilities.reports.dto.ReportRequestDTO
uses edge.jsonmapper.JsonProperty
uses edge.capabilities.policycommon.accountcontact.dto.AccountContactDTO
uses edge.capabilities.quote.draft.dto.AdditionalNamedInsuredDTO

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/26/17
 * Time: 8:49 AM
 * To change this template use File | Settings | File Templates.
 */
class CreditReportRequestDTO extends ReportRequestDTO{
  @JsonProperty
  private var _creditContact : CreditContact_Ext as CreditOrderingContact

  @JsonProperty
  private var _primaryInsured : AccountContactDTO as PrimaryInsured

  @JsonProperty
  private var _coInsured : AdditionalNamedInsuredDTO as CoInsured
}