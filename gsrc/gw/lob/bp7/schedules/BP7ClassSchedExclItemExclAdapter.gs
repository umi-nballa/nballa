package gw.lob.bp7.schedules

uses gw.coverage.ExclusionAdapterBase
uses gw.api.productmodel.ExclusionPattern

@Export
class BP7ClassSchedExclItemExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7ClassSchedExclItemExcl
  
  construct(owner : BP7ClassSchedExclItemExcl)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.ClassSchedExclItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.ClassSchedExclItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.ClassSchedExclItem
  }

  
  override function addToExclusionArray( clause: Exclusion )
  {
    _owner.ClassSchedExclItem.createExclusion(clause.Pattern as ExclusionPattern)
  }

  override function removeFromParent()
  {
    _owner.ClassSchedExclItem.removeExclusionFromCoverable(_owner)
  }

}
