package edge.capabilities.frameworkcapabilities.datetime.dto

uses edge.time.OffsetDateTimeDTO
uses edge.jsonmapper.JsonProperty
uses java.util.Date

/**
 * Response for the Offset date/time.
 */
class OffsetDateTimeResponseDTO {
  /**
   * Representation of the original request.
   */
  @JsonProperty
  private var _originalDate : OffsetDateTimeDTO as OriginalDate


  /**
   * Representation of the time on the server.
   */
  @JsonProperty
  private var _serverTime : String as ServerTime



  /**
   * Full (recovered) representation of the date.
   */
  @JsonProperty
  private var _fullInfo : String as FullInfo


  /**
   * Instant of the time.
   */
  @JsonProperty
  private var _instant : Date as Instant
}
