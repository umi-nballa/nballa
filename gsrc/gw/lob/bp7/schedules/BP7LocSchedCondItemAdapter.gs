 package gw.lob.bp7.schedules

uses gw.api.domain.Clause
uses gw.api.productmodel.Schedule
uses gw.lob.common.AbstractScheduledItemAdapter
uses gw.policy.PolicyLineConfiguration

 class BP7LocSchedCondItemAdapter extends AbstractScheduledItemAdapter {

  var _owner : BP7LocSchedCondItem as readonly Owner

  construct(item : BP7LocSchedCondItem) {
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
    return AllConditions.firstWhere(\cov -> cov.Pattern == ScheduleParent.ScheduledItemMultiPatterns?.first())
  }

  override function hasClause() : boolean {
    return Clause != null
  }

  override property get AllConditions() : PolicyCondition[] {
    return _owner.Condition == null ? {} : {_owner.Condition}
  }

  override function addCondition(clause : PolicyCondition) {
   _owner.Condition = clause as BP7LocSchedCondItemCond
  }

  override function removeCondition(clause : PolicyCondition) {
    if(_owner.Condition == clause){
      _owner.Condition.remove()
    }
  }
  override property get DefaultCurrency() : Currency {
    return _owner.Branch.BP7Line.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_BP7).AllowedCurrencies
  }
}