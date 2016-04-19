package gw.lob.bp7.schedules

uses gw.coverage.ConditionAdapterBase
uses gw.api.productmodel.ConditionPattern

@Export
class BP7LocSchedCondItemCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7LocSchedCondItemCond  
  
  construct(owner : BP7LocSchedCondItemCond)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.LocSchedCondItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.LocSchedCondItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.LocSchedCondItem
  }

  
  override function addToConditionArray( clause: PolicyCondition )
  {
    _owner.LocSchedCondItem.Condition = clause as BP7LocSchedCondItemCond
  }

  override function removeFromParent()
  {
    _owner.LocSchedCondItem.removeConditionFromCoverable(_owner)
  }

}
