package gw.lob.bp7.schedules

uses gw.lob.bp7.schedules.BP7ScheduledItem
uses gw.lob.bp7.service.BP7ServiceLocator
uses gw.lob.common.schedules.ScheduleConfigSource

class BP7BusinessIncomeScheduledItem extends BP7ScheduledItem {
  
  construct(item : BP7LineSchedCovItem) {
    super(item)
  }
  
  property get ExemptEmployee() : String {
    var locator = BP7ServiceLocator.get(ScheduleConfigSource)
    return locator.getScheduledItemValueProvider<String>("ExemptEmployee", ScheduledItem).Value
  }
  
  property get ExemptJobClassification() : String {
    var locator = BP7ServiceLocator.get(ScheduleConfigSource)
    return locator.getScheduledItemValueProvider<String>("ExemptJobClassification", ScheduledItem).Value
  }
}
