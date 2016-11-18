package edge.capabilities.frameworkcapabilities.datetime.dto

uses edge.time.InstantDTO
uses edge.jsonmapper.JsonProperty
uses java.util.Date

/**
 * A response for the "Instant" date demo.
 */
class InstantDemoResponseDTO {
  /** Date as it was sent. */
  @JsonProperty
  private var _originalDate : InstantDTO as OriginalDate

  /** Date as understood by server. */
  @JsonProperty
  private var _serverTime : String as ServerTime

  /** Corresponding instant representation, should not be used in future. */
  @JsonProperty
  private var _instant : Date as Instant
}
