package edge.time

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Range
uses edge.time.annotation.DayOfMonth

/**
 * A date without a time-zone similar to java.time.LocalDate.
 *
 * <p>This class does not represent a fixed moment in time (instant) or any time interval.
 * It is a description of date as used in birthdays.</p>
 */
class LocalDateDTO {
  /** ISO year. */
  @JsonProperty
  @Range(0, 5000)
  private var _year : int as Year

  @JsonProperty
  @Range(0, 12)
  private var _month : int as Month

  /** Day of the month. */
  @JsonProperty
  @DayOfMonth
  private var _day : int as Day
}
