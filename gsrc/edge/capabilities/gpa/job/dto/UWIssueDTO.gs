package edge.capabilities.gpa.job.dto

uses edge.jsonmapper.JsonProperty

class UWIssueDTO {
  @JsonProperty
  var _longDescription : String as LongDescription

  @JsonProperty
  var _shortDescription : String as ShortDescription

}
