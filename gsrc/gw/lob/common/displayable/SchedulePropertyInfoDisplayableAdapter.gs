package gw.lob.common.displayable

uses gw.api.productmodel.SchedulePropertyInfo
uses gw.api.productmodel.ClausePattern

interface SchedulePropertyInfoDisplayableAdapter {

  function isMatch(pattern : ClausePattern) : boolean

  function isVisible<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>) : boolean
  function isEditable<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>) : boolean
  function getValueRange<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>) : List<T>
  function getValidValue<T>(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo<T>, value : T)  : T
}