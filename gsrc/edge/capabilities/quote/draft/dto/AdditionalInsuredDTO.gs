package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/17
 * Time: 10:38 AM
 * To change this template use File | Settings | File Templates.
 */
class AdditionalInsuredDTO extends PolicyContactDTO{
  @JsonProperty
  private var _additionalInsuredType : typekey.AdditionalInsuredType as Type

  @JsonProperty
  private var _additionalInsuredCoverageType : typekey.AddlInsuredCovType_Ext as CoverageType

  @JsonProperty
  private var _interestType : typekey.AddlInsdInterestType_Ext as InterestType
}