package gw.lob.common.schedules

uses gw.api.domain.Clause
uses gw.api.productmodel.IValueRangeGetter
uses gw.api.productmodel.Schedule

/**
 * Default implementation for the PolicyLocation value range
 */
class ClausePolicyLocationValueRangeGetter implements IValueRangeGetter {
  var _clause: Schedule & Clause
  construct(clause: Clause & Schedule) {
    _clause = clause
  }

  override property get ValueRange(): KeyableBean[] {
    return _clause.PolicyLine.Branch.PolicyLocations
  }
}