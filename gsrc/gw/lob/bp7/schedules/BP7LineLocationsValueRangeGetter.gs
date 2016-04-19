package gw.lob.bp7.schedules

uses gw.api.productmodel.IValueRangeGetter
uses gw.api.productmodel.Schedule
uses gw.api.domain.Clause

class BP7LineLocationsValueRangeGetter implements IValueRangeGetter {

  var _clause : Clause & Schedule

  construct(owner : Clause & Schedule) {
    _clause = owner
  }

  override property get ValueRange(): gw.pl.persistence.core.entity.KeyableBean[] {
    return (_clause.OwningCoverable as BP7Line).BP7Locations
  }
}