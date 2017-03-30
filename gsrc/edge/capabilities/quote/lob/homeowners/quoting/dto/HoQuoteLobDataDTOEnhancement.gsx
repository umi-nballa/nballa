package edge.capabilities.quote.lob.homeowners.quoting.dto

uses edge.jsonmapper.JsonProperty

enhancement HoQuoteLobDataDTOEnhancement : edge.capabilities.quote.lob.dto.QuoteLobDataDTO {
  @JsonProperty
  property get Homeowners() : HoAvailableCoveragesDTO {
    return this.lobExtensions.get(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE) as HoAvailableCoveragesDTO
  }

  @JsonProperty
  property set Homeowners(data : HoAvailableCoveragesDTO) {
    this.lobExtensions.put(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE, data)
  }
}
