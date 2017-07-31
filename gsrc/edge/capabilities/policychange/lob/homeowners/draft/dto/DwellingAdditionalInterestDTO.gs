package edge.capabilities.policychange.lob.homeowners.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses java.util.Date
uses java.lang.Long
uses edge.capabilities.quote.draft.dto.PolicyContactDTO

class DwellingAdditionalInterestDTO extends PolicyContactDTO{

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
  var _certificateRequired : Boolean as CertificateRequired

  /** Effective Date for this additional interest */
  @JsonProperty @Required
  var _effectiveDate : Date as EffectiveDate

  @JsonProperty
  private var _interestTypeIfOther : String as InterestTypeIfOther

  @JsonProperty
  private var _vestingInfoRequired : Boolean as IsVestingInfoRequired

  @JsonProperty
  private var _vestingInfo : String as VestingInfo

  @JsonProperty
  private var _dbaName : String as DBAName
}
