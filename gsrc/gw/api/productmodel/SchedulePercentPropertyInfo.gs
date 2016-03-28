package gw.api.productmodel

uses gw.lang.reflect.IType

uses java.lang.Integer

class SchedulePercentPropertyInfo extends AbstractSchedulePropertyInfo<Integer> {
  construct(scheduledItemType: IType, columnName: String, columnLabel: String, isRequired: boolean) {
    super(scheduledItemType, columnName, columnLabel, isRequired)
  }

  construct(columnName: String, columnLabel: String, isRequired: boolean) {
    super(columnName, columnLabel, isRequired)
  }

  override property get ValueType(): String {
    return "Percent"
  }
}