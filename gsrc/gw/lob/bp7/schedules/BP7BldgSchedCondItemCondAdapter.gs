package gw.lob.bp7.schedules

uses gw.coverage.ConditionAdapterBase
uses gw.api.productmodel.ConditionPattern

@Export
class BP7BldgSchedCondItemCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7BldgSchedCondItemCond  
  
  construct(owner : BP7BldgSchedCondItemCond)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.BldgSchedCondItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.BldgSchedCondItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.BldgSchedCondItem
  }

  override function addToConditionArray( clause: PolicyCondition )
  {
    _owner.BldgSchedCondItem.createCondition(clause.Pattern as ConditionPattern)
  }

  override function removeFromParent()
  {
    _owner.BldgSchedCondItem.removeConditionFromCoverable(_owner)
  }

}
