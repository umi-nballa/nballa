package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7ClassSchedCondItemMatcher extends AbstractScheduledItemMatcher<BP7ClassSchedCondItem> {

  construct(owner : BP7ClassSchedCondItem) {
    super(owner, "Schedule")
  }
}