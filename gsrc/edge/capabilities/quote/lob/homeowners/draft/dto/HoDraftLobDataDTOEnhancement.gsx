package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty

enhancement HoDraftLobDataDTOEnhancement : edge.capabilities.quote.lob.dto.DraftLobDataDTO {
  @JsonProperty
  property get Homeowners() : HoDraftDataExtensionDTO {
    return this.lobExtensions.get(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE) as HoDraftDataExtensionDTO
  }


  @JsonProperty
  property set Homeowners(v : HoDraftDataExtensionDTO) {
    this.lobExtensions.put(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE, v)
  }
}
