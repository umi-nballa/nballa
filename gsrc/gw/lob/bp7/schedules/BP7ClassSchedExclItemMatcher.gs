package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7ClassSchedExclItemMatcher extends AbstractScheduledItemMatcher<BP7ClassSchedExclItem> {

  construct(owner : BP7ClassSchedExclItem) {
    super(owner, "Schedule")
  }
}