package gw.api.productmodel

uses gw.lang.reflect.IType

class ScheduleStringPropertyInfoWithDefaultValue extends ScheduleStringPropertyInfo {
  var _defaultValue: String as DefaultValue

  construct(columnName: String, colLabel: String, isRequired: boolean, defaultValue: String) {
    super(columnName, colLabel, isRequired)
    _defaultValue = defaultValue
  }

  construct(scheduledItemType: IType, columnName: String, colLabel: String, isRequired: boolean, defaultValue: String) {
    super(scheduledItemType, columnName, colLabel, isRequired)
    _defaultValue = defaultValue
  }
}