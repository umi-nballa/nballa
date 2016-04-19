package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7BldgSchedCovItemMatcher extends AbstractScheduledItemMatcher<BP7BldgSchedCovItem> {

  construct(owner : BP7BldgSchedCovItem) {
    super(owner, "Schedule")
  }
}