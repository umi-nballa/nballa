package edge.capabilities.frameworkcapabilities.datetime

uses edge.jsonrpc.IRpcHandler
uses edge.di.annotations.InjectableNode
uses edge.jsonrpc.annotation.JsonRpcUnauthenticatedMethod
uses edge.time.LocalDateUtil
uses java.text.SimpleDateFormat
uses edge.time.LocalDateDTO
uses edge.capabilities.frameworkcapabilities.datetime.dto.LocalDateDemoResponseDTO
uses edge.time.InstantDTO
uses edge.capabilities.frameworkcapabilities.datetime.dto.InstantDemoResponseDTO
uses edge.time.InstantUtil
uses edge.time.OffsetDateTimeDTO
uses edge.capabilities.frameworkcapabilities.datetime.dto.OffsetDateTimeResponseDTO
uses edge.time.OffsetDateTimeUtil

/**
 * Date/time demo handler.
 */
class DatetimeDemoHandler implements IRpcHandler {
  @InjectableNode
  construct() {}

  /**
   * Demonstrates a local date interpretation.
   */
  @JsonRpcUnauthenticatedMethod
  public function demoLocalDate(dto : LocalDateDTO) : LocalDateDemoResponseDTO {
    final var res = new LocalDateDemoResponseDTO()
    res.OriginalDate = dto
    res.Instant = LocalDateUtil.toMidnightDate(dto)
    res.ServerTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z").format(res.Instant)
    return res
  }

  /**
   * Demonstrates an instant representation.
   */
  @JsonRpcUnauthenticatedMethod
  public function demoInstant(dto : InstantDTO) : InstantDemoResponseDTO {
    var res = new InstantDemoResponseDTO()
    res.OriginalDate = dto
    res.Instant = InstantUtil.toDate(dto)
    res.ServerTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z").format(res.Instant)
    return res
  }


  /**
   * Demonstrates an offset date/time handling.
   */
  @JsonRpcUnauthenticatedMethod
  public function demoOffsetDateTime(dto : OffsetDateTimeDTO) : OffsetDateTimeResponseDTO {
    var res = new OffsetDateTimeResponseDTO()
    res.OriginalDate = dto
    res.Instant = OffsetDateTimeUtil.toDate(dto)
    res.ServerTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z").format(res.Instant)

    final var fullFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z")
    fullFormat.setCalendar(OffsetDateTimeUtil.toCalendar(dto))
    res.FullInfo = fullFormat.format(res.Instant)
    return res
  }
}
