package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduleWithDescriptionImpl

class BP7BldgSchedExclImpl extends AbstractScheduleWithDescriptionImpl<BP7BldgSchedExcl> {

  construct(delegateOwner : BP7BldgSchedExcl) {
    super(delegateOwner)
  }

  override property get ScheduledItems() : ScheduledItem[] {
    return Owner.ScheduledItems
  }

  override function createAndAddScheduledItem() : ScheduledItem {
    var scheduledItem = new BP7BldgSchedExclItem(Owner.Branch)
    createAutoNumber(scheduledItem)
    Owner.addToScheduledItems(scheduledItem)
    initializeScheduledItemIfCoverable(scheduledItem)
    return scheduledItem
  }

  override function removeScheduledItem(item : ScheduledItem) {
    Owner.removeFromScheduledItems(item as BP7BldgSchedExclItem)
    renumberAutoNumberSequence()
  }

  override property get CurrentAndFutureScheduledItems() : KeyableBean[] {
    var schedItems = Owner.ScheduledItems.toList()

    Owner.Branch.OOSSlices
      .where(\ period -> period.BP7Line != null)
      .each(\ period -> {
        var matchingSlicedScheduleExcl = period.BP7Line.ExclusionsFromCoverable.firstWhere(\ c -> c.FixedId == Owner.FixedId) as BP7BldgSchedExcl
        if (matchingSlicedScheduleExcl != null) {
          matchingSlicedScheduleExcl.ScheduledItems.each(\ s -> {
            if (!schedItems.contains(s)) {
              schedItems.add(s)
            }
          })
        }
      })
    return schedItems.toTypedArray()
  }
}