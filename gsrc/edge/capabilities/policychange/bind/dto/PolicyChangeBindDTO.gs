package edge.capabilities.policychange.bind.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.policychange.dto.PolicyChangeDTO
uses edge.aspects.validation.annotations.Required

class PolicyChangeBindDTO {

  @JsonProperty
  @Required
  var _policyChange : PolicyChangeDTO as PolicyChange

  /** Indicates whether or not the changes made were automatically merged forward to a future unbound renewal. */
  @JsonProperty
  @Required
  var _changesAppliedForward : boolean as ChangesAppliedForward

}
