package edge.capabilities.frameworkcapabilities.datetime.dto

uses edge.time.LocalDateDTO
uses edge.jsonmapper.JsonProperty
uses java.util.Date

/**
 * Response to the Local Date Time request.
 */
class LocalDateDemoResponseDTO {
  /**
   * Date originally passed to the backend.j
   */
  @JsonProperty
  var _originalDate : LocalDateDTO as OriginalDate

  /**
   * Date as it was stored (in the server representation).
   */
  @JsonProperty
  var _serverTime : String as ServerTime;

  /**
   * The same date as serverTime but incorrectly represented as an instant.
   */
  @JsonProperty
  var _instant : Date as Instant
}
