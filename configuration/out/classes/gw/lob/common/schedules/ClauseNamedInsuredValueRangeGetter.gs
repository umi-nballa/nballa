package gw.lob.common.schedules

uses gw.api.domain.Clause
uses gw.api.productmodel.IValueRangeGetter
uses gw.api.productmodel.Schedule

class ClauseNamedInsuredValueRangeGetter implements IValueRangeGetter {
  var _clause: Schedule & Clause
  construct(cov: Schedule & Clause) {
    _clause = cov
  }

  override property get ValueRange(): KeyableBean[] {
    return _clause.PolicyLine.Branch.NamedInsureds
  }
}