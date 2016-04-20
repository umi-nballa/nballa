package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7LineSchedCovItemMatcher extends AbstractScheduledItemMatcher<BP7LineSchedCovItem> {

  construct(owner : BP7LineSchedCovItem) {
    super(owner, "Schedule")
  }
}