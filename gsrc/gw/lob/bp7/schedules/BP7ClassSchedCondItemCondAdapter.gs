package gw.lob.bp7.schedules

uses gw.coverage.ConditionAdapterBase
uses gw.api.productmodel.ConditionPattern

@Export
class BP7ClassSchedCondItemCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7ClassSchedCondItemCond  
  
  construct(owner : BP7ClassSchedCondItemCond)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.ClassSchedCondItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.ClassSchedCondItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.ClassSchedCondItem
  }
  
  override function addToConditionArray( clause: PolicyCondition )
  {
    _owner.ClassSchedCondItem.createCondition(clause.Pattern as ConditionPattern)
  }

  override function removeFromParent()
  {
    _owner.ClassSchedCondItem.removeConditionFromCoverable(_owner)
  }

}
