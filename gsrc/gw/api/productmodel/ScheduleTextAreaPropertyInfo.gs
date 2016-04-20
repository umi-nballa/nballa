package gw.api.productmodel

uses gw.lang.reflect.IType

public class ScheduleTextAreaPropertyInfo extends AbstractSchedulePropertyInfo<String> {

  /**
   * Constructs a new column info with the passed arguments.
   *
   * @param columnName Column name
   * @param colLabel   Text to display for the column label in LVs
   * @param isRequired Whether or not the input cell should be required
   * @param defaultValue The default value for the column
   *
   * @throws IllegalArgumentException if columnName or colLabel is null or no property named <code>columnName</code>
   *                                  exists on <code>ScheduledItem</code>
   */
  construct (columnName : String, colLabel : String, isRequired : boolean) {
    super(columnName, colLabel, isRequired)
  }

  /**
   * Constructs a new column info with the passed arguments.
   * This can used to construct property info for columns on LOB specific scheduled item
   *
   * @param scheduledItemType   Type of scheduled item
   * @param columnName          Column name
   * @param colLabel            Text to display for the column label in LVs
   * @param isRequired          Whether or not the input cell should be required
   * @param defaultValue The default value for the column
   *
   * @throws IllegalArgumentException if columnName or colLabel is null or no property named <code>columnName</code>
   *                                  exists on <code>ScheduledItem</code>
   */
  construct(scheduledItemType : IType , columnName : String, colLabel : String, isRequired : boolean) {
    super(scheduledItemType, columnName, colLabel, isRequired)
  }

  override property get ValueType() : String {
    return "TextArea";
  }
}
