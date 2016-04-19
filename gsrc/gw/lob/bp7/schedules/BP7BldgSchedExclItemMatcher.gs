package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7BldgSchedExclItemMatcher extends AbstractScheduledItemMatcher<BP7BldgSchedExclItem> {

  construct(owner : BP7BldgSchedExclItem) {
    super(owner, "Schedule")
  }
}