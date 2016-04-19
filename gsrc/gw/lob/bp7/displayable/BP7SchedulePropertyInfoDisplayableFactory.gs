package gw.lob.bp7.displayable

uses gw.api.productmodel.ClausePattern
uses gw.lob.common.displayable.ForeignKeyScheduledItemDisplayableAdapter
uses gw.lob.common.displayable.SchedulePropertyInfoDisplayableAdapter
uses gw.lob.common.displayable.SchedulePropertyInfoDisplayableFactory

uses java.util.Map

class BP7SchedulePropertyInfoDisplayableFactory extends SchedulePropertyInfoDisplayableFactory {
  override property get LineSpecificDisplayableAdapters(): List<SchedulePropertyInfoDisplayableAdapter> {
    return {new ForeignKeyScheduledItemDisplayableAdapter()}
  }

  override property get SchedulePropertyInfosHasDependents(): Map<ClausePattern, List<String>> {
    return {}
  }
}