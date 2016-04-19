package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduleWithDescriptionImpl
uses gw.api.productmodel.SchedulePropertyInfo

class BP7LineSchedCovImpl extends AbstractScheduleWithDescriptionImpl<BP7LineSchedCov> {

  construct(delegateOwner : BP7LineSchedCov) {
    super(delegateOwner)
  }

  override property get ScheduledItems() : ScheduledItem[] {
    return Owner.ScheduledItems
  }

  override property get MostDescriptivePropertyInfo() : SchedulePropertyInfo {
    if (Owner.PatternCode == "BP7BusinessIncome") {
      // override the default diff labels
      return null
    }

    return super.MostDescriptivePropertyInfo
  }

  override function createAndAddScheduledItem() : ScheduledItem {
    var scheduledItem = new BP7LineSchedCovItem(Owner.Branch)
    createAutoNumber(scheduledItem)
    Owner.addToScheduledItems(scheduledItem)
    initializeScheduledItemIfCoverable(scheduledItem)
    return scheduledItem
  }

  override function removeScheduledItem(item : ScheduledItem) {
    Owner.removeFromScheduledItems(item as BP7LineSchedCovItem)
    renumberAutoNumberSequence()
  }

  override property get CurrentAndFutureScheduledItems() : KeyableBean[] {
    var schedItems = Owner.ScheduledItems.toList()

    Owner.Branch.OOSSlices
      .where(\ period -> period.BP7Line != null)
      .each(\ period -> {
        var matchingSlicedScheduleCov = period.BP7Line.CoveragesFromCoverable.firstWhere(\ c -> c.FixedId == Owner.FixedId) as BP7LineSchedCov
        if (matchingSlicedScheduleCov != null) {
          matchingSlicedScheduleCov.ScheduledItems.each(\ s -> {
            if (!schedItems.contains(s)) {
              schedItems.add(s)
            }
          })
        }
      })
    return schedItems.toTypedArray()
  }
}