 package gw.lob.bp7.schedules

uses gw.api.domain.Clause
uses gw.api.productmodel.Schedule
uses gw.lob.common.AbstractScheduledItemAdapter
uses gw.policy.PolicyLineConfiguration

class BP7LocSchedCovItemAdapter extends AbstractScheduledItemAdapter {

  var _owner : BP7LocSchedCovItem as readonly Owner

  construct(item : BP7LocSchedCovItem) {
    _owner = item
  }

  override property get ScheduleParent() : Schedule {
    return _owner.Schedule
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.Schedule.PolicyLine
  }

  // processed by the coverable generator - made the scheduled item a coverable
  override property get Clause() : Clause {
    return AllCoverages.firstWhere(\cov -> cov.Pattern == ScheduleParent.ScheduledItemMultiPatterns?.first())
  }

  override function hasClause() : boolean {
    return Clause != null
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.Coverages == null ? {} : _owner.Coverages
  }

  override function addCoverage(clause : Coverage) {
   _owner.addToCoverages(clause as BP7LocSchedCovItemCov)
  }

  override function removeCoverage(clause : Coverage) {
    _owner.removeFromCoverages(clause as BP7LocSchedCovItemCov)
  }

  override property get DefaultCurrency() : Currency {
    return _owner.Branch.BP7Line.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_BP7).AllowedCurrencies
  }
}