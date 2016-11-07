package edge.capabilities.frameworkcapabilities.wizard.dto

uses edge.jsonmapper.JsonProperty

enhancement PAClaimDemoLobDToEnhancement : ClaimDemoLobDTO {
  @JsonProperty
  property get PersonalAuto() : PAClaimDemoExtensionDTO {
    return this.lobExtensions.get('PersonalAuto') as PAClaimDemoExtensionDTO
  }

  @JsonProperty
  property set PersonalAuto(data : PAClaimDemoExtensionDTO) {
    this.lobExtensions.put('PersonalAuto', data)
  }
}
