package gw.lob.bp7.schedules

uses gw.coverage.ExclusionAdapterBase
uses gw.api.productmodel.ExclusionPattern

@Export
class BP7LineSchedExclItemExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7LineSchedExclItemExcl  
  
  construct(owner : BP7LineSchedExclItemExcl)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.LineSchedExclItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.LineSchedExclItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.LineSchedExclItem
  }
  
  override function addToExclusionArray( clause: Exclusion )
  {
    _owner.LineSchedExclItem.createExclusion(clause.Pattern as ExclusionPattern)
  }

  override function removeFromParent()
  {
    _owner.LineSchedExclItem.removeExclusionFromCoverable(_owner)
  }

}
