package edge.capabilities.policy.lob.homeowners.dto

uses edge.capabilities.policy.lob.dto.PolicyLineBaseDTO
uses edge.jsonmapper.JsonProperty
uses edge.capabilities.policy.dto.CoverageDTO
uses edge.capabilities.policy.lob.dto.IPolicyLobExtensionDTO
uses edge.capabilities.currency.dto.AmountDTO
uses edge.aspects.validation.annotations.Required

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 4/7/17
 * Time: 9:23 AM
 * To change this template use File | Settings | File Templates.
 */
class HoPolicyExtensionDTO extends PolicyLineBaseDTO implements IPolicyLobExtensionDTO {

  @JsonProperty
  var _coverageDTOs : CoverageDTO[] as CoverageDTOs

  @JsonProperty @Required
  var _taxesAndSurcharges : AmountDTO as TaxesAndSurcharges

  @JsonProperty @Required
  var _totalCost : AmountDTO as TotalCost
}