package gw.lob.bp7.schedules

uses gw.coverage.ExclusionAdapterBase
uses gw.api.productmodel.ExclusionPattern

@Export
class BP7BldgSchedExclItemExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7BldgSchedExclItemExcl
  
  construct(owner : BP7BldgSchedExclItemExcl)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.BldgSchedExclItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.BldgSchedExclItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.BldgSchedExclItem
  }

  
  override function addToExclusionArray( clause: Exclusion )
  {
    _owner.BldgSchedExclItem.createExclusion(clause.Pattern as ExclusionPattern)
  }

  override function removeFromParent()
  {
    _owner.BldgSchedExclItem.removeExclusionFromCoverable(_owner)
  }

}
