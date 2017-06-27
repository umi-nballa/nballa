package edge.capabilities.reports.dto.credit

uses edge.capabilities.reports.dto.ReportRequestDTO
uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/26/17
 * Time: 8:49 AM
 * To change this template use File | Settings | File Templates.
 */
class CreditReportRequestDTO extends ReportRequestDTO{
  @JsonProperty
  private var _creditContact : CreditContact_Ext as CreditContact
}