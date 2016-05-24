package gw.lob.common.schedules

uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.api.productmodel.ScheduleStringPropertyInfo
uses gw.api.productmodel.ScheduleTypeKeyPropertyInfo
uses gw.lang.reflect.IPropertyInfo
uses gw.lob.common.AbstractScheduleImpl
uses gw.lob.common.dependency.FieldDependency
uses gw.lob.common.schedules.impl.ScheduleConfigXMLInfoProvider
uses gw.lob.common.service.ServiceLocator

uses java.util.ArrayList
uses gw.api.productmodel.ScheduleTypePropertyInfoWithDefaultValue
uses gw.api.productmodel.ScheduleStringPropertyInfoWithDefaultValue

abstract class AbstractScheduleWithDescriptionImpl<T extends ScheduleAutoNumberSequence & Schedule & gw.api.domain.Clause>
    extends AbstractScheduleImpl<T> implements ScheduleMultiPatterns{
  construct(delegateOwner : T) {
    super(delegateOwner)
  }

  override property get PropertyInfos() : SchedulePropertyInfo[] {
    return ServiceLocator.get(ScheduleConfigSource).getPropertyInfos<T>(Owner)
  }

  protected function setScheduledItemDefaultValues(scheduledItem :ScheduledItem) {
    PropertyInfos.each( \ info -> {
      if (info typeis ScheduleStringPropertyInfoWithDefaultValue) {
        //at present, only this PropertyInfo supports a DefaultValue
        if (info.DefaultValue != null and info.DefaultValue.HasContent) {
          info.PropertyInfo.Accessor.setValue(scheduledItem, info.DefaultValue)
        }
      } else if (info typeis ScheduleTypePropertyInfoWithDefaultValue) {
        //at present, only this PropertyInfo supports a DefaultValue
        if (info.DefaultValue != null) {
          info.PropertyInfo.Accessor.setValue(scheduledItem, info.DefaultValue)
        }
      }
    })
  }

  protected function initializeScheduledItemIfCoverable(scheduledItem :ScheduledItem) {
    if (scheduledItem typeis Coverable) {
      initializeScheduledItem(scheduledItem)
    }
  }

  override protected function initializeScheduledItem(scheduledItem : Coverable & ScheduledItem) {
    scheduledItem.createCoveragesConditionsAndExclusions()
    if (scheduledItem typeis FieldDependency) {
      scheduledItem.updateDependentFields()
    }
  }

  override property get MostDescriptivePropertyInfo() : SchedulePropertyInfo {
    return null
  }

  override function getScheduledItemDescription(scheduledItem : ScheduledItem) : String {
    var configSource = ServiceLocator.get(ScheduleConfigSource)
    var identityColumns = configSource.getScheduledItemKeyColumns(scheduledItem)
    var columnNames : List<String>
    var columnValues : List<String>
    if (identityColumns.Empty) {
      columnNames = { PropertyInfos.singleWhere( \ propertyInfo -> propertyInfo.PropertyInfo == ScheduleNumberPropInfo).Label }
      columnValues = { scheduledItem.ScheduleNumber.toString() }
    } else {
      columnNames = identityColumns.map( \ prop -> ScheduleConfigXMLInfoProvider.getLabel(prop))
      columnValues = configSource.getScheduledItemKeyDisplayNames(scheduledItem).toList()
    }

    var namesWithValues = new ArrayList<String>()
    columnNames?.eachWithIndex( \ name, index -> namesWithValues.add("${name} - ${columnValues[index] ?: ""}"))

    var description = namesWithValues.join(" | ")
    return description.NotBlank ? description : (scheduledItem as EffDated).TypeIDString
  }

  override property get ScheduleNumberPropInfo() : IPropertyInfo {
    return ScheduledItem#ScheduleNumber.PropertyInfo
  }

  override property get ScheduledItemPattern() : ClausePattern {
    if(ScheduledItemMultiPatterns.Count > 1) {
      throw "please use ScheduledItemMultiPatterns"
    }
    return ScheduledItemMultiPatterns.first()
  }

  override property get ScheduledItemMultiPatterns() : ClausePattern[] {
    return ServiceLocator.get(ScheduleConfigSource).getClauseMultiPatterns(Owner).toTypedArray()
  }
}
