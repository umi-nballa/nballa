package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7LocSchedExclItemMatcher extends AbstractScheduledItemMatcher<BP7LocSchedExclItem> {

  construct(owner : BP7LocSchedExclItem) {
    super(owner, "Schedule")
  }
}