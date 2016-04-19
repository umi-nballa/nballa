package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7LineSchedExclItemMatcher extends AbstractScheduledItemMatcher<BP7LineSchedExclItem> {

  construct(owner : BP7LineSchedExclItem) {
    super(owner, "Schedule")
  }
}