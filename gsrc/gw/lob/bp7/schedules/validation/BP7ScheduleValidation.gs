package gw.lob.bp7.schedules.validation

uses gw.api.domain.Clause
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.lob.bp7.BP7Categories
uses gw.lob.bp7.displayable.BP7SchedulePropertyInfoDisplayableFactory
uses gw.lob.common.schedules.ScheduleConfigSource
uses gw.lob.common.schedules.impl.ScheduleConfigXMLInfoProvider
uses gw.lob.common.schedules.schemas.schedule_config.types.complex.PropertyInfoType
uses gw.lob.common.service.ServiceLocator
uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

uses java.util.HashSet

class BP7ScheduleValidation extends PCValidationBase {
  var _configSource = ServiceLocator.get(ScheduleConfigSource)
  private var _schedule: Schedule & Clause
  construct(valContext: PCValidationContext, schedule: Schedule & Clause) {
    super(valContext)
    _schedule = schedule
  }

  override function validateImpl() {
    validateRequiredProperties()
    validateScheduledItemsHasClausesSelected()
    validateScheduledItemsHaveUniqueKeys()
    validateSpecificSchedules()
  }

  private function validateRequiredProperties() {
    var requiredPropertyInfos = _schedule
        .PropertyInfos
        .where(\propertyInfo -> propertyInfo.Required)

    _schedule.ScheduledItems.each(\scheduledItem -> {
      requiredPropertyInfos.each(\requiredPropertyInfo -> {
        var displayable = new BP7SchedulePropertyInfoDisplayableFactory().createEditableSchedulePropertyInfoDisplayable(scheduledItem, requiredPropertyInfo)
        if (displayable.Visible and displayable.Editable and requiredPropertyInfo.createValueProvider(scheduledItem).Value == null) {
          addMissingRequiredFieldError(scheduledItem, requiredPropertyInfo)
        }
      })
    })
  }

  private function validateScheduledItemsHasClausesSelected() {
    if (_schedule.isComplexSchedule) {
      var noClauseScheduledItems = _schedule.ScheduledItems.where(\scheduledItem -> {
        return scheduledItem typeis Coverable and
            scheduledItem.CoveragesConditionsAndExclusionsFromCoverable.where(\cov -> _schedule.ScheduledItemMultiPatterns.contains(cov.Pattern)).IsEmpty
      })

      if (noClauseScheduledItems.HasElements) {
        var listOfItems = noClauseScheduledItems*.ScheduleNumber.sort().join(", ")
        Result.addError(_schedule,
            ValidationLevel.TC_DEFAULT, displaykey.Web.Policy.BP7.Validation.MissingSelectedClauses(_schedule.ScheduleName, listOfItems),
            null)
      }
    }
  }

  private function validateScheduledItemsHaveUniqueKeys() {
    if (not hasKeys()) return

    var keySet = new HashSet<String>()

    _schedule.ScheduledItems.each(\item -> {
      var keyString = descriptionForComparison(item)

      if (keySet.contains(keyString)) {
        Result.addError(item as KeyableBean,
            ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.Common.Schedule.DuplicateRows(_configSource.getScheduledItemKeyColumns(item).map(\prop -> ScheduleConfigXMLInfoProvider.getLabel(prop)).join(" | ")),
            null)

        return
      } else {
        keySet.add(keyString)
      }
    })
  }

  private function descriptionForComparison(item: ScheduledItem): String {
    var configSource = ServiceLocator.get(ScheduleConfigSource)
    var identityColumns = configSource.getScheduledItemKeyColumns(item)
    var namesWithValues: List<String> = {}
    if (identityColumns?.HasElements){
      namesWithValues = getScheduledItemKeyNamesForComparison(item, identityColumns)
    }
    var description = namesWithValues.join(" | ")
    return description.NotBlank ? description : (item as EffDated).TypeIDString
  }

  private function getScheduledItemKeyNamesForComparison(item: ScheduledItem,
                                                         identityColumns: List<PropertyInfoType>): List<String> {
    return identityColumns.map(\info -> {
      var value = item.getFieldValue(info.ColumnName)
      var comparisonValue = (value typeis EffDated) ? value.TypeIDString : value as String
      return "${ScheduleConfigXMLInfoProvider.getLabel(info)} - ${comparisonValue ?: ""}"
    })
  }

  private function hasKeys(): boolean {
    return _schedule.ScheduledItems.HasElements and
        _configSource.getScheduledItemKeyColumns(_schedule.ScheduledItems.first()).HasElements
  }

  private function checkRequiredFieldNotNull(propertyName: String, scheduledItem: ScheduledItem) {
    var schedulePropertyInfo = ServiceLocator.get(ScheduleConfigSource).getSchedulePropertyInfoByName(propertyName, _schedule)
    var propertyValue = schedulePropertyInfo.createValueProvider(scheduledItem).Value
    if (propertyValue == null) {
      addMissingRequiredFieldError(scheduledItem, schedulePropertyInfo)
    }
  }

  private function addMissingRequiredFieldError(scheduledItem: ScheduledItem, schedulePropertyInfo: SchedulePropertyInfo) {
    Result.addFieldError(
        scheduledItem as KeyableBean,
            schedulePropertyInfo.PropertyInfo.Name,
            ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.MissingRequiredField(
                _schedule.ScheduleName,
                    scheduledItem.Description
            ),
            null
    )
  }

  private function validateSpecificSchedules() {
    if (_schedule.Pattern.CoverageCategoryID == BP7Categories.BP7LineAddlInsuredGrp.Code ||
        _schedule.Pattern.CoverageCategoryID == BP7Categories.BP7LocationAddlInsuredGrp.Code){
      new BP7AdditionalInsuredScheduleValidation(_schedule, Result).validate()
    }
  }

  static function validateSchedule(schedule: Schedule & Clause) {
    PCValidationContext.doPageLevelValidation(\context -> {
      new BP7ScheduleValidation(context, schedule).validate()
    })
  }
}
