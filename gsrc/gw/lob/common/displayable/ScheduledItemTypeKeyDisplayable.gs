package gw.lob.common.displayable

uses gw.entity.TypeKey
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.api.productmodel.SchedulePropertyValueProvider

class ScheduledItemTypeKeyDisplayable extends ScheduledItemPropertyInfoDisplayable<TypeKey> {

  protected construct(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo, displayableAdapter : SchedulePropertyInfoDisplayableAdapter) {
    super(scheduledItem, propertyInfo, displayableAdapter)
    _valueProvider = PropertyValueProvider as SchedulePropertyValueProvider<String>
  }

  override property get Value(): TypeKey {
    return PropertyValueRange.firstWhere( \ key -> key.Code == _valueProvider.Value as String)
  }

  override property set Value(newValue: TypeKey) {
    _valueProvider.Value = newValue.Code
  }
}