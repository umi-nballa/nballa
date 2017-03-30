package edge.capabilities.policychange.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty

enhancement HoDraftLobDataDTOEnhancement : edge.capabilities.policychange.dto.DraftLobDataDTO {
  @JsonProperty
  property get HomeOwners() : HoDraftDataExtensionDTO {
    return this.lobExtensions.get(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE) as HoDraftDataExtensionDTO
  }


  @JsonProperty
  property set HomeOwners(v : HoDraftDataExtensionDTO) {
    this.lobExtensions.put(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE, v)
  }
}
