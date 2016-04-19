package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduleWithDescriptionImpl
uses gw.api.productmodel.SchedulePropertyInfo

class BP7LocSchedCondImpl extends AbstractScheduleWithDescriptionImpl<BP7LocSchedCond> {

  construct(delegateOwner : BP7LocSchedCond) {
    super(delegateOwner)
  }

  override property get ScheduledItems() : ScheduledItem[] {
    return Owner.ScheduledItems
  }

  override function createAndAddScheduledItem() : ScheduledItem {
    var scheduledItem = new BP7LocSchedCondItem(Owner.Branch)
    createAutoNumber(scheduledItem)
    Owner.addToScheduledItems(scheduledItem)
    initializeScheduledItemIfCoverable(scheduledItem)
    return scheduledItem
  }

  override function removeScheduledItem(item : ScheduledItem) {
    Owner.removeFromScheduledItems(item as BP7LocSchedCondItem)
    renumberAutoNumberSequence()
  }

  override property get MostDescriptivePropertyInfo() : SchedulePropertyInfo {
    if (Owner.Pattern == "BP7DesignatedPremisesProject") {
      // override the default diff labels
      return null
    }

    return super.MostDescriptivePropertyInfo
  }

  override property get CurrentAndFutureScheduledItems() : KeyableBean[] {
    var schedItems = Owner.ScheduledItems.toList()

    Owner.Branch.OOSSlices
      .where(\ period -> period.BP7Line != null)
      .each(\ period -> {
        var matchingSlicedScheduleCond = period.BP7Line.ConditionsFromCoverable.firstWhere(\ c -> c.FixedId == Owner.FixedId) as BP7LocSchedCond
        if (matchingSlicedScheduleCond != null) {
          matchingSlicedScheduleCond.ScheduledItems.each(\ s -> {
            if (!schedItems.contains(s)) {
              schedItems.add(s)
            }
          })
        }
      })
    return schedItems.toTypedArray()
  }
}