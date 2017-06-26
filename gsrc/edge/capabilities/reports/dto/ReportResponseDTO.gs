package edge.capabilities.reports.dto

uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/8/17
 * Time: 2:56 PM
 * To change this template use File | Settings | File Templates.
 */
class ReportResponseDTO {
  @JsonProperty
  var _reportStatus : String as ReportStatus

  @JsonProperty
  var _errors : List<String> as Errors
}