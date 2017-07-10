package edge.capabilities.quote.draft.dto

uses edge.capabilities.address.dto.AddressDTO
uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/7/17
 * Time: 2:22 PM
 * To change this template use File | Settings | File Templates.
 */
class TrustDTO {
  @JsonProperty
  private var _address : AddressDTO as Address

  @JsonProperty
  private var _beneficiaryName : String as NameOfBeneficiary

  @JsonProperty
  private var _nameOfGrantor : String as NameOfGrantor

  @JsonProperty
  private var _isPartyToTrustACorporation : Boolean as IsPartyToTrustACorporation

  @JsonProperty
  private var _trustResident : typekey.TrustResident_Ext as TrustResident

  @JsonProperty
  private var _isTrustRevocable : Boolean as IsTrustTypeLivingAndRevocable
}