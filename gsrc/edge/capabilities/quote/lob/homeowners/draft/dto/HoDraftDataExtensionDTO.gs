package edge.capabilities.quote.lob.homeowners.draft.dto

uses edge.capabilities.quote.lob.dto.IDraftLobExtensionDTO
uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required
uses edge.capabilities.address.dto.AddressDTO
uses edge.capabilities.quote.questionset.dto.QuestionSetAnswersDTO

/**
 * Homeowners extension for quote draft.
 */
class HoDraftDataExtensionDTO implements IDraftLobExtensionDTO {

  /** Address of this dwelling. */
  @JsonProperty @Required
  var _policyAddress: AddressDTO as PolicyAddress

  @JsonProperty
  var _preQualQuestionSets : QuestionSetAnswersDTO[] as PreQualQuestionSets

  /** Additional details about construction. */
  @JsonProperty
  var _construction : ConstructionDTO as Construction

  @JsonProperty
  var _yourHome : YourHomeDTO as YourHome

  /** Additional details about rating. */
  @JsonProperty
  var _rating : RatingDTO as Rating
}
