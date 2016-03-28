package gw.api.productmodel

uses gw.lang.reflect.IType
uses java.math.BigDecimal

class ScheduleDecimalPropertyInfo extends gw.api.productmodel.AbstractSchedulePropertyInfo<BigDecimal> {

  var _minimum : BigDecimal as Minimum
  var _maximum : BigDecimal as Maximum

  /**
   * Constructs a new decimal column info with min and max information.
   *
   * @param columnName Column name
   * @param colLabel   Text to display for the column label in LVs
   * @param isRequired Whether or not the input cell should be required
   * @param minimum lowest value for this decimal property
   * @param maximum highest value for this decimal property
   *
   * @throws java.lang.IllegalArgumentException if columnName or colLabel is null or no property named <code>columnName</code>
   *                                  exists on <code>ScheduledItem</code>
   */
  construct(columnName : String, colLabel : String, isRequired : boolean, minimum : BigDecimal, maximum : BigDecimal) {
    super(columnName, colLabel, isRequired)
    _minimum = minimum
    _maximum = maximum
  }

  /**
   * Constructs a new decimal column info with min and max information.
   * This can used to construct property info for columns on LOB specific scheduled item
   *
   * @param scheduledItemType   Type of scheduled item
   * @param columnName          Column name
   * @param colLabel            Text to display for the column label in LVs
   * @param isRequired          Whether or not the input cell should be required
   * @param minimum lowest value for this decimal property
   * @param maximum highest value for this decimal property
   *
   * @throws java.lang.IllegalArgumentException if columnName or colLabel is null or no property named <code>columnName</code>
   *                                  exists on <code>ScheduledItem</code>
   */
  construct(scheduledItemType : IType, columnName : String, colLabel : String, isRequired : boolean, minimum : BigDecimal, maximum : BigDecimal) {
    super(scheduledItemType, columnName, colLabel, isRequired)
    _minimum = minimum
    _maximum = maximum
  }

  override property get ValueType() : String {
    return "BigDecimal"
  }

  /**
   * Validates the given value.
   * @return String - if the given value is within the range allowed returns null, otherwise an error message
   */
  override function validate(value : BigDecimal) : String {
    if (Minimum != null && value < Minimum) {
      return displaykey.Web.Policy.Schedule.ScheduledItem.Validation.IntegerPropertyLessThanMinimum(value, Minimum)
    }
    if (Maximum != null && value > Maximum) {
      return displaykey.Web.Policy.Schedule.ScheduledItem.Validation.IntegerPropertyGreaterThanMaximum(value, Maximum)
    }
    return null
  }
}