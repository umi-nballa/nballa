package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduleWithDescriptionImpl
uses gw.api.productmodel.SchedulePropertyInfo

class BP7LineSchedExclImpl extends AbstractScheduleWithDescriptionImpl<BP7LineSchedExcl> {

  construct(delegateOwner : BP7LineSchedExcl) {
    super(delegateOwner)
  }

  override property get ScheduledItems() : ScheduledItem[] {
    return Owner.ScheduledItems
  }

  override property get MostDescriptivePropertyInfo() : SchedulePropertyInfo {
    if (Owner.PatternCode == "BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs") {
      if (PropertyInfoMap.get("ScheduleNumber") != null) {
        return PropertyInfoMap.get("ScheduleNumber")
      }
    }

    return super.MostDescriptivePropertyInfo
  }

  override function createAndAddScheduledItem() : ScheduledItem {
    var scheduledItem = new BP7LineSchedExclItem(Owner.Branch)
    createAutoNumber(scheduledItem)
    Owner.addToScheduledItems(scheduledItem)
    initializeScheduledItemIfCoverable(scheduledItem)
    return scheduledItem
  }

  override function removeScheduledItem(item : ScheduledItem) {
    Owner.removeFromScheduledItems(item as BP7LineSchedExclItem)
    renumberAutoNumberSequence()
  }

  override property get CurrentAndFutureScheduledItems() : KeyableBean[] {
    var schedItems = Owner.ScheduledItems.toList()

    Owner.Branch.OOSSlices
      .where(\ period -> period.BP7Line != null)
      .each(\ period -> {
        var matchingSlicedScheduleExcl = period.BP7Line.ExclusionsFromCoverable.firstWhere(\ c -> c.FixedId == Owner.FixedId) as BP7LineSchedExcl
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