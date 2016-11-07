package edge.capabilities.frameworkcapabilities.wizard.dto

uses edge.jsonmapper.JsonProperty

enhancement HOClaimDemoLobDToEnhancement: ClaimDemoLobDTO {
  @JsonProperty
  property get Homeowners() : HOClaimDemoExtensionDTO {
    return this.lobExtensions.get('Homeowners') as HOClaimDemoExtensionDTO
  }

  @JsonProperty
  property set Homeowners(data : HOClaimDemoExtensionDTO) {
    this.lobExtensions.put('Homeowners', data)
  }
}
