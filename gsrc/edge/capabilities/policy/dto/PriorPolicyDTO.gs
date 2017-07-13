package edge.capabilities.policy.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/7/17
 * Time: 9:55 AM
 * To change this template use File | Settings | File Templates.
 */
class PriorPolicyDTO {
  @JsonProperty
  var _priorCarrierType : CarrierType_Ext as CarrierType

  @JsonProperty
  var _priorCarrierOther : String as CarrierOther

  @JsonProperty @Required
  var _priorExpirationDate : Date as ExpirationDate

  @JsonProperty
  var _priorPolicyNumber : String as PolicyNumber

  @JsonProperty
  var _reasonNoPriorInsurance : ReasonNoPriorIns_Ext as ReasonNoPriorInsurance

  @JsonProperty
  var _tenure : Tenure_Ext as Tenure

}