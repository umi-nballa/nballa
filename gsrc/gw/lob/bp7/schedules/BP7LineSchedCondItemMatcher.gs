package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7LineSchedCondItemMatcher extends AbstractScheduledItemMatcher<BP7LineSchedCondItem> {

  construct(owner : BP7LineSchedCondItem) {
    super(owner, "Schedule")
  }
}