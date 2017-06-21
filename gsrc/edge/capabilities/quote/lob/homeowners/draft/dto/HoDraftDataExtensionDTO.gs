package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.capabilities.quote.lob.dto.IDraftLobExtensionDTO
uses edge.jsonmapper.JsonProperty
uses edge.capabilities.address.dto.AddressDTO
uses edge.capabilities.quote.questionset.dto.QuestionSetAnswersDTO
uses edge.capabilities.quote.lob.dto.UnaLobDataDTO
uses edge.capabilities.policy.coverages.UNACoverageDTO

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

  /** Additional details about rating. */
  @JsonProperty
  var _rating : RatingDTO as Rating

  @JsonProperty
  var _coverages : UNACoverageDTO[] as Coverages

  @JsonProperty
  var _excludePersonalProperty : Boolean as ExcludePersonalProperty
}
