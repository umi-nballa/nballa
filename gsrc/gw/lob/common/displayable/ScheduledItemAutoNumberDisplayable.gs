package gw.lob.common.displayable

uses gw.api.productmodel.SchedulePropertyInfo

class ScheduledItemAutoNumberDisplayable extends ScheduledItemPropertyInfoDisplayable<java.lang.Integer> {

  protected construct(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo, displayableAdapter : SchedulePropertyInfoDisplayableAdapter) {
    super(scheduledItem, propertyInfo, displayableAdapter)
  }

  override property get Editable(): boolean {
    return false
  }
}