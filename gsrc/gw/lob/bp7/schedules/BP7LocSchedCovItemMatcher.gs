package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7LocSchedCovItemMatcher extends AbstractScheduledItemMatcher<BP7LocSchedCovItem> {

  construct(owner : BP7LocSchedCovItem) {
    super(owner, "Schedule")
  }
}