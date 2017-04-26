package edge.capabilities.policy.lob.homeowners.dto

uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 4/11/17
 * Time: 8:21 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement HoPolicyLobDataDTOEnhancement : edge.capabilities.policy.lob.dto.PolicyLobDataDTO {

  @JsonProperty
  property get HomeownersLine_HOE() : HoPolicyExtensionDTO {
    return this.lobExtensions.get(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE) as HoPolicyExtensionDTO
  }

  @JsonProperty
  property set HomeownersLine_HOE(data : HoPolicyExtensionDTO) {
    this.lobExtensions.put(typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE, data)
  }
}
