package gw.lob.bp7.schedules

abstract class BP7ScheduledItem {

  var _item : BP7LineSchedCovItem as readonly ScheduledItem

  construct(item : BP7LineSchedCovItem) {
    _item = item
  }
}