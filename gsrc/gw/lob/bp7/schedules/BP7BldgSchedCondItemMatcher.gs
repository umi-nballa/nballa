package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7BldgSchedCondItemMatcher extends AbstractScheduledItemMatcher<BP7BldgSchedCondItem> {

  construct(owner : BP7BldgSchedCondItem) {
    super(owner, "Schedule")
  }
}