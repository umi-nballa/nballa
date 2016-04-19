package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduleWithDescriptionImpl

class BP7LineSchedCondImpl extends AbstractScheduleWithDescriptionImpl<BP7LineSchedCond> {

  construct(delegateOwner : BP7LineSchedCond) {
    super(delegateOwner)
  }

  override property get ScheduledItems() : ScheduledItem[] {
    return Owner.ScheduledItems
  }

  override function createAndAddScheduledItem() : ScheduledItem {
    var scheduledItem = new BP7LineSchedCondItem(Owner.Branch)
    createAutoNumber(scheduledItem)
    Owner.addToScheduledItems(scheduledItem)
    initializeScheduledItemIfCoverable(scheduledItem)
    return scheduledItem
  }

  override function removeScheduledItem(item : ScheduledItem) {
    Owner.removeFromScheduledItems(item as BP7LineSchedCondItem)
    renumberAutoNumberSequence()
  }

  override property get CurrentAndFutureScheduledItems() : KeyableBean[] {
    var schedItems = Owner.ScheduledItems.toList()

    Owner.Branch.OOSSlices
      .where(\ period -> period.BP7Line != null)
      .each(\ period -> {
        var matchingSlicedScheduleCond = period.BP7Line.ConditionsFromCoverable.firstWhere(\ c -> c.FixedId == Owner.FixedId) as BP7LineSchedCond
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