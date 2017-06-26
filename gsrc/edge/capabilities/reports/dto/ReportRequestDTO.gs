package edge.capabilities.reports.dto

uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/8/17
 * Time: 3:22 PM
 * To change this template use File | Settings | File Templates.
 */
class ReportRequestDTO {
  @JsonProperty
  private var _jobNumber : String as JobNumber

  @JsonProperty
  private var _nodeID : String as AccountNumber
}