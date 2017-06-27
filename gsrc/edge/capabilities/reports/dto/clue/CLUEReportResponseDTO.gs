package edge.capabilities.reports.dto.clue

uses edge.capabilities.reports.dto.ReportResponseDTO
uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/8/17
 * Time: 2:59 PM
 * To change this template use File | Settings | File Templates.
 */
class CLUEReportResponseDTO extends ReportResponseDTO{
  @JsonProperty
  private var _priorLosses : List<PriorLossDTO> as PriorLosses
}