package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.capabilities.quote.lob.dto.IDraftLobExtensionDTO
uses edge.jsonmapper.JsonProperty
uses edge.capabilities.address.dto.AddressDTO
uses edge.capabilities.quote.questionset.dto.QuestionSetAnswersDTO
uses edge.capabilities.quote.lob.dto.UnaLobDataDTO
uses edge.capabilities.policy.coverages.UNACoverageDTO
uses edge.capabilities.quote.draft.dto.AdditionalInsuredDTO
uses edge.capabilities.policychange.lob.homeowners.draft.dto.DwellingAdditionalInterestDTO
uses edge.capabilities.quote.draft.dto.AdditionalNamedInsuredDTO
uses edge.capabilities.quote.draft.dto.TrustDTO
uses edge.capabilities.reports.dto.clue.PriorLossDTO
uses edge.capabilities.policy.dto.PriorPolicyDTO
uses java.lang.Integer

/**
 * Homeowners extension for quote draft.
 */
class HoDraftDataExtensionDTO extends UnaLobDataDTO implements IDraftLobExtensionDTO {

  /** Address of this dwelling. */
  @JsonProperty
  var _policyAddress: AddressDTO as PolicyAddress

  @JsonProperty
  var _questionAnswers : QuestionSetAnswersDTO[] as QuestionAnswers

  /** Additional details about construction. */
  @JsonProperty
  var _construction : ConstructionDTO as Construction

  @JsonProperty
  var _yourHome : YourHomeDTO as YourHome

  @JsonProperty
  var _yourHomeProtection : YourHomeProtectionDTO as YourHomeProtection

  /** Additional details about rating. */
  @JsonProperty
  var _rating : RatingDTO as Rating

  @JsonProperty
  var _coverages : UNACoverageDTO[] as Coverages

  @JsonProperty
  var _clauseDTO : List<String> as ConditionsAndExclusions


  @JsonProperty
  var _additionalInsureds : AdditionalInsuredDTO [] as AdditionalInsureds

  @JsonProperty
  var _additionalNamedInsureds : AdditionalNamedInsuredDTO [] as AdditionalNamedInsureds

  @JsonProperty
  var _additionalInterests : DwellingAdditionalInterestDTO[] as AdditionalInterests

  @JsonProperty
  var _trusts : TrustDTO[] as Trusts

  @JsonProperty
  var _selfReportedLosses : PriorLossDTO[] as SelfReportedPriorLosses

  @JsonProperty
  var _priorPolicy : PriorPolicyDTO as PriorPolicy

  @JsonProperty
  var _propertiesUnderCommonOwnership : NumberPrptiesCmmnOwnr_Ext as PropertiesUnderCommonOwnership

  @JsonProperty
  var _areAllOwnershipInterestsLLCs : Boolean as AreAllOwnershipInterestsLLCs

  @JsonProperty
  var _isDwellingOccupiedAsPrimaryResidenceByAllOwners : Boolean as IsDwellingOccupiedAsPrimaryResidenceByAllOwners

  @JsonProperty
  var _ownershipEntityType : AccountOrgType as OwnershipEntityType

  @JsonProperty
  var _ownershipEntityTypeOtherDescription : String as OwnershipEntityTypeOtherDescription

  @JsonProperty
  var _creditLevel : CreditLevelExt as CreditLevel
}
