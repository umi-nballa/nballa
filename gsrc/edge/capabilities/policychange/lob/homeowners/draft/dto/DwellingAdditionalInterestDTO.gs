package edge.capabilities.policychange.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses java.util.Date
uses edge.capabilities.policycommon.accountcontact.dto.AccountContactDTO
uses java.lang.Long

class DwellingAdditionalInterestDTO {

  /** Unique fixed ID for the additional interest */
  @JsonProperty
  var _fixedId : Long as FixedId

  /** Type of this additional interest */
  @JsonProperty
  var _type : typekey.AdditionalInterestType as Type

  /** Number of any contract associated with the dwelling additional interest */
  @JsonProperty
  var _contractNumber : String as ContractNumber

  /** Description of the additional interest */
  @JsonProperty @Required
  var _description : String as Description

  /** Is a certificate required for this additional interest */
  @JsonProperty
  var _certificateRequired : boolean as CertificateRequired

  /** Effective Date for this additional interest */
  @JsonProperty @Required
  var _effectiveDate : Date as EffectiveDate

  /** A contact representing the additional interest */
  @JsonProperty @Required
  var _policyAdditionalInterest : AccountContactDTO as PolicyAdditionalInterest


}
