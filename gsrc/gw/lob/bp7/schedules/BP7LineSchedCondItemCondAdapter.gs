package gw.lob.bp7.schedules

uses gw.coverage.ConditionAdapterBase
uses gw.api.productmodel.ConditionPattern

@Export
class BP7LineSchedCondItemCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7LineSchedCondItemCond  
  
  construct(owner : BP7LineSchedCondItemCond)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.LineSchedCondItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.LineSchedCondItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.LineSchedCondItem
  }
  
  override function addToConditionArray( clause: PolicyCondition )
  {
    _owner.LineSchedCondItem.createCondition(clause.Pattern as ConditionPattern)
  }

  override function removeFromParent()
  {
    _owner.LineSchedCondItem.removeConditionFromCoverable(_owner)
  }

}
