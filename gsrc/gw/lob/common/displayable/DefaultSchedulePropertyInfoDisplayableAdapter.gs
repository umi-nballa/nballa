package gw.lob.common.displayable

uses gw.lob.common.schedules.ScheduleConfigSource
uses gw.lob.common.service.ServiceLocator
uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.SchedulePropertyInfo

class DefaultSchedulePropertyInfoDisplayableAdapter implements SchedulePropertyInfoDisplayableAdapter {

  protected var _scheduleConfig : ScheduleConfigSource

  construct() {
    _scheduleConfig = ServiceLocator.get(ScheduleConfigSource)
  }

  override function isMatch(pattern : ClausePattern) : boolean {
    return true
  }

  override function isVisible<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>) : boolean {
    return true
  }

  override function isEditable<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>) : boolean {
    var editable = isVisible<T>(scheduledItem, propertyInfo)

    if (editable) {
      var values = getValueRange(scheduledItem, propertyInfo)
      var readOnlyTrigger = propertyInfo.Required ? 1 : 0

      if (values != null) {
        editable = values.Count > readOnlyTrigger
      }
    }

    return editable
  }

  override function getValueRange<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>) : List<T> {
    return propertyInfo.ValueRange as List<T>
  }

  override function getValidValue<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>, value : T) : T {
    var validValue = value
    var validValues = getValueRange<T>(scheduledItem, propertyInfo)

    if (validValues != null and not validValues.contains(value)) {
      validValue = (validValues.Count == 1) ? validValues.first() : null
    }

    return validValue
  }
}