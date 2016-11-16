package edge.capabilities.policy.lob.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.currency.dto.AmountDTO
uses java.util.Date
uses edge.aspects.validation.annotations.Required

/** 
 * Base DTO for all the policy lines. Each policy line should
 * add it's own properties to it.
 */
class PolicyLineBaseDTO {
  @JsonProperty
  var _publicID : String as PublicID

  @JsonProperty @Required
  var _policyNumber : String as PolicyNumber
  
  @JsonProperty @Required
  var _lineOfBusiness : String as LineOfBusiness

  @JsonProperty @Required
  var _expirationDate : Date as ExpirationDate
  
  @JsonProperty @Required
  var _effectiveDate : Date   as EffectiveDate
  
  @JsonProperty @Required
  var _status : String as Status
    
  @JsonProperty @Required
  var _totalPremium : AmountDTO as TotalPremium

  construct() {

  }

}
