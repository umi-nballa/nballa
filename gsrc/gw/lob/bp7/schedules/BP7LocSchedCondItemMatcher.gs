package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7LocSchedCondItemMatcher extends AbstractScheduledItemMatcher<BP7LocSchedCondItem> {

  construct(owner : BP7LocSchedCondItem) {
    super(owner, "Schedule")
  }
}