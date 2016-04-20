package gw.lob.common.displayable

uses gw.api.productmodel.SchedulePropertyInfo
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.ClausePattern
uses gw.api.domain.Clause
uses gw.api.productmodel.ScheduleReadOnlyPropertyInfo
uses java.util.Date
uses java.math.BigDecimal
uses gw.lob.common.dependency.FieldDependency
uses java.util.Map
uses java.lang.Integer

abstract class SchedulePropertyInfoDisplayableFactory {

  abstract property get LineSpecificDisplayableAdapters(): List<SchedulePropertyInfoDisplayableAdapter>
  abstract property get SchedulePropertyInfosHasDependents(): Map<ClausePattern, List<String>>

  function shouldDisplayPropertyInfoOnUI(schedulePattern: ClausePattern, scheduledItem: ScheduledItem, propInfo: SchedulePropertyInfo): boolean {
    return DisplayableAdapters.firstWhere(\a -> a.isMatch(schedulePattern)).isVisible(scheduledItem, propInfo)
  }

  function doesScheduleHaveDependent(schedule: Schedule): boolean {
    return SchedulePropertyInfosHasDependents.keySet().contains((schedule as Clause).Pattern)
  }

  function doesPropertyHaveDependents(scheduledItem: ScheduledItem, propertyInfo: SchedulePropertyInfo): boolean {
    return scheduledItem typeis FieldDependency
        and SchedulePropertyInfosHasDependents.get((scheduledItem.ScheduleParent as Clause).Pattern)?.contains(propertyInfo.Label)
  }

  function doesPropertyHaveDependents(schedule: Schedule, propertyInfo: SchedulePropertyInfo): boolean {
    return SchedulePropertyInfosHasDependents.get((schedule as Clause).Pattern)?.contains(propertyInfo.Label)
  }

  property get DisplayableAdapters(): List<SchedulePropertyInfoDisplayableAdapter> {
    return LineSpecificDisplayableAdapters.concat({new DefaultSchedulePropertyInfoDisplayableAdapter()}).toList()
  }

  function createEditableSchedulePropertyInfoDisplayable(item: ScheduledItem, propertyInfo: SchedulePropertyInfo): Displayable {
    var adapter = DisplayableAdapters.firstWhere(\adapter -> adapter.isMatch((item.ScheduleParent as Clause).Pattern))

    switch (propertyInfo.ValueType) {
      case "AutoNumber":
          return new ScheduledItemAutoNumberDisplayable(item, propertyInfo, adapter)
      case "Boolean":
          return new ScheduledItemPropertyInfoDisplayable<Boolean>(item, propertyInfo, adapter)
      case "Integer":
      case "Percent":
      case "IntegerRange":
          return new ScheduledItemPropertyInfoDisplayable(item, propertyInfo, adapter)
      case "TextArea":
      case "String":
          if (propertyInfo typeis ScheduleReadOnlyPropertyInfo) {
            return new ReadOnlyScheduledItemPropertyInfoDisplayable<String>(item, propertyInfo, adapter)
          }
          return new ScheduledItemPropertyInfoDisplayable<String>(item, propertyInfo, adapter)
      case "Date":
          return new ScheduledItemPropertyInfoDisplayable<Date>(item, propertyInfo, adapter)
      case "ForeignKey":
          return new ScheduledItemPropertyInfoDisplayable<KeyableBean>(item, propertyInfo, adapter)
      case "TypeKey":
          return new ScheduledItemTypeKeyDisplayable(item, propertyInfo, adapter)
      case "BigDecimal":
          return new ScheduledItemPropertyInfoDisplayable<BigDecimal>(item, propertyInfo, adapter)
      case "AdditionalInsured":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<PolicyAddlInsuredDetail>(item, propertyInfo, adapter)
      case "AdditionalInterest":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<AddlInterestDetail>(item, propertyInfo, adapter)
        default:
        throw "Unsupported property info type: " + propertyInfo.ValueType
    }
  }

  function createReadOnlySchedulePropertyInfoDisplayable(item: ScheduledItem, propertyInfo: SchedulePropertyInfo): Displayable {
    var adapter = DisplayableAdapters.firstWhere(\adapter -> adapter.isMatch((item.ScheduleParent as Clause).Pattern))

    switch (propertyInfo.ValueType) {
      case "AutoNumber":
          return new ScheduledItemAutoNumberDisplayable(item, propertyInfo, adapter)
      case "Boolean":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<Boolean>(item, propertyInfo, adapter)
      case "Integer":
      case "Percent":
      case "IntegerRange":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<Integer>(item, propertyInfo, adapter)
      case "TextArea":
      case "String":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<String>(item, propertyInfo, adapter)
      case "Date":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<Date>(item, propertyInfo, adapter)
      case "ForeignKey":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<KeyableBean>(item, propertyInfo, adapter)
      case "TypeKey":
          return new ReadOnlyScheduledItemTypeKeyDisplayable(item, propertyInfo, adapter)
      case "BigDecimal":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<BigDecimal>(item, propertyInfo, adapter)
      case "AdditionalInsured":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<PolicyAddlInsuredDetail>(item, propertyInfo, adapter)
      case "AdditionalInterest":
          return new ReadOnlyScheduledItemPropertyInfoDisplayable<AddlInterestDetail>(item, propertyInfo, adapter)
        default:
        throw "Unsupported property info type: " + propertyInfo.ValueType
    }
  }
}