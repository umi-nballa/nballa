package edge.capabilities.frameworkcapabilities.wizard.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required

class HOClaimDemoExtensionDTO implements IClaimDemoLobExtensionDTO {

  @JsonProperty
  var _step1PropA : String as Step1PropA

  @JsonProperty
  @Required
  var _step1PropB : String as Step1PropB

  @JsonProperty
  var _step2PropA : String as Step2PropA

  @JsonProperty
  var _step2PropB : String as Step2PropB

}
