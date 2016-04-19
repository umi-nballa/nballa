package gw.lob.bp7.schedules

uses gw.coverage.ExclusionAdapterBase
uses gw.api.productmodel.ExclusionPattern

@Export
class BP7LocSchedExclItemExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7LocSchedExclItemExcl  
  
  construct(owner : BP7LocSchedExclItemExcl)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return(_owner.LocSchedExclItem.CoverableState)
  }

  override property get PolicyLine() : PolicyLine
  {
    return(_owner.LocSchedExclItem.Schedule.PolicyLine)
  }

  override property get OwningCoverable() : Coverable
  {
    return(_owner.LocSchedExclItem)
  }

  override function addToExclusionArray( clause: Exclusion )
  {
    _owner.LocSchedExclItem.createExclusion(clause.Pattern as ExclusionPattern)
  }

  override function removeFromParent()
  {
    _owner.LocSchedExclItem.removeExclusionFromCoverable(_owner)
  }

}
