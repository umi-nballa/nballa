package gw.lob.bp7.schedules

uses gw.lob.common.schedules.AbstractScheduledItemMatcher

class BP7ClassSchedCovItemMatcher extends AbstractScheduledItemMatcher<BP7ClassSchedCovItem> {

  construct(owner : BP7ClassSchedCovItem) {
    super(owner, "Schedule")
  }
}