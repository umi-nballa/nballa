package edge.capabilities.gpa.policy.dto

uses edge.jsonmapper.JsonProperty

class PolicyLineDTO {

  // Language independent LOB Identifier
  @JsonProperty ()
  var _lineOfBusinessCode : String as LineOfBusinessCode

  // Localized LOB Name
  @JsonProperty ()
  var _lineOfBusinessName : String as LineOfBusinessName
}
